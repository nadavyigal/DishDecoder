import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import morgan from 'morgan';
import { logger, stream } from './utils/logger.js';
import aiLogger from './utils/aiLogger.js';
import { adaptRecipe, getAvailableDietaryTypes } from './utils/recipeAdapter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Load recipes database
const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, 'recipes.json'), 'utf8'));

// Middleware
app.use(cors());
app.use(express.json());

// Setup request logging with Morgan and Winston
app.use(morgan('combined', { stream }));

// Measure request duration for performance monitoring
app.use((req, res, next) => {
  req.requestTime = Date.now();
  res.on('finish', () => {
    const responseTime = Date.now() - req.requestTime;
    logger.http({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime
    });
  });
  next();
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'));
    }
  }
});

function findMatchingRecipe(dishName) {
  const normalizedDishName = dishName.toLowerCase();
  
  // Find a recipe where the dish name matches any of the keywords
  return Object.values(recipes).find(recipe => 
    recipe.keywords.some(keyword => 
      normalizedDishName.includes(keyword) || keyword.includes(normalizedDishName)
    )
  );
}

app.post('/api/upload', upload.single('image'), async (req, res) => {
  const requestStartTime = Date.now();
  
  try {
    if (!req.file) {
      logger.warn('Upload attempted without a file');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    logger.info(`Processing uploaded image: ${req.file.filename}`);

    // Read the file as base64
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString('base64');

    // Predict food items using OpenAI
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "What food item is in this image? Respond with just the food name, no other text." },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 100
      });

      // Get the prediction
      const dishName = response.choices[0].message.content.trim();
      const confidence = 0.95; // OpenAI doesn't provide confidence scores like Clarifai

      // Log prediction result
      aiLogger.prediction('food-recognition', {
        predictedDish: dishName,
        otherPossibilities: [] // OpenAI doesn't provide alternatives in the simple format we're using
      }, Math.round(confidence * 100));

      // Find matching recipe
      const matchingRecipe = findMatchingRecipe(dishName);
      
      // Log validation result
      aiLogger.validation('recipe-match', dishName, {
        matched: !!matchingRecipe,
        matchedName: matchingRecipe ? matchingRecipe.title : null
      });
      
      const recipeId = matchingRecipe ? `recipe-${Date.now()}` : null;

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      // Log performance
      const responseTime = Date.now() - requestStartTime;
      aiLogger.performance('food-recognition-total', responseTime, {
        imageSize: req.file.size,
        predictedDish: dishName,
        confidence: Math.round(confidence * 100)
      });

      res.status(200).json({ 
        id: recipeId,
        dishName,
        confidence: Math.round(confidence * 100),
        found: !!matchingRecipe
      });
    } catch (aiError) {
      // Log AI-specific error
      aiLogger.error('openai-prediction', aiError, { 
        fileName: req.file.filename,
        fileSize: req.file.size 
      });
      
      // Fall back to a default recipe if AI fails
      aiLogger.fallback('food-recognition', 'default-recipe', {
        strategy: 'first-available-recipe'
      });
      
      // Take first recipe as fallback
      const fallbackRecipe = Object.values(recipes)[0];
      const recipeId = `recipe-fallback-${Date.now()}`;
      
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      
      // Return fallback response
      res.status(200).json({
        id: recipeId,
        dishName: fallbackRecipe.title.split(' ')[0], // Simple name extraction
        confidence: 0, // Indicate this was a fallback with 0 confidence
        found: true,
        fallback: true
      });
    }
  } catch (error) {
    logger.error(`Upload error: ${error.message}`, { error: error.stack });
    
    // Clean up the file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Server error during upload' });
  }
});

// Get available dietary types
app.get('/api/dietary-preferences', (req, res) => {
  try {
    logger.info('Fetching available dietary preferences');
    const dietaryTypes = getAvailableDietaryTypes();
    res.status(200).json({ dietaryTypes });
  } catch (error) {
    logger.error(`Error fetching dietary preferences: ${error.message}`, { error: error.stack });
    res.status(500).json({ error: 'Server error fetching dietary preferences' });
  }
});

// Get a recipe adapted for dietary preferences
app.get('/api/recipes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { dietaryType } = req.query;
    
    logger.info(`Recipe requested: ${id}${dietaryType ? `, adapted for ${dietaryType}` : ''}`);
    
    // Check if this is a fallback recipe ID
    const isFallback = id.includes('fallback');
    
    // Extract dish name from the recipe ID and find matching recipe
    let matchingRecipe;
    
    if (isFallback) {
      matchingRecipe = Object.values(recipes)[0]; // For fallback, return first recipe
    } else {
      matchingRecipe = Object.values(recipes)[0]; // For demo, return first recipe
      // In a real implementation, we would parse the ID and find the correct recipe
    }
    
    if (!matchingRecipe) {
      logger.warn(`Recipe not found: ${id}`);
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // If dietary preference is provided, adapt the recipe
    if (dietaryType) {
      logger.info(`Adapting recipe ${id} for ${dietaryType} diet`);
      const adaptedRecipe = adaptRecipe(matchingRecipe, dietaryType);
      return res.status(200).json({
        id,
        ...adaptedRecipe
      });
    }

    // Return the original recipe if no dietary preference
    res.status(200).json({
      id,
      ...matchingRecipe
    });
  } catch (error) {
    logger.error(`Error fetching recipe: ${error.message}`, { error: error.stack });
    res.status(500).json({ error: 'Server error fetching recipe' });
  }
});

// Get recipe adaptation for a specific dietary preference
app.post('/api/recipes/:id/adapt', (req, res) => {
  try {
    const { id } = req.params;
    const { dietaryType } = req.body;
    
    if (!dietaryType) {
      return res.status(400).json({ error: 'Dietary type is required' });
    }
    
    logger.info(`Adapting recipe ${id} for ${dietaryType} diet`);
    
    // Find the recipe by ID
    const isFallback = id.includes('fallback');
    let matchingRecipe;
    
    if (isFallback) {
      matchingRecipe = Object.values(recipes)[0];
    } else {
      matchingRecipe = Object.values(recipes)[0]; // For demo, return first recipe
    }
    
    if (!matchingRecipe) {
      logger.warn(`Recipe not found: ${id}`);
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    // Adapt the recipe for the requested dietary type
    const adaptedRecipe = adaptRecipe(matchingRecipe, dietaryType);
    
    res.status(200).json({
      id,
      ...adaptedRecipe
    });
  } catch (error) {
    logger.error(`Error adapting recipe: ${error.message}`, { error: error.stack });
    res.status(500).json({ error: 'Server error adapting recipe' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, { error: err.stack });
  res.status(500).json({ error: 'Something went wrong' });
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;