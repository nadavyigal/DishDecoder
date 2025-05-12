import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  isSubstitute: {
    type: Boolean,
    default: false
  },
  original: {
    type: String
  }
}, { _id: false });

const StepSchema = new mongoose.Schema({
  instruction: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  originalInstruction: {
    type: String
  }
}, { _id: false });

const VideoTutorialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    enum: ['youtube', 'vimeo'],
    required: true
  },
  videoId: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  duration: {
    type: String
  }
}, { _id: false });

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Recipe image is required']
  },
  ingredients: [IngredientSchema],
  steps: [StepSchema],
  prepTime: {
    type: Number,
    required: true,
    min: 0
  },
  cookTime: {
    type: Number,
    required: true,
    min: 0
  },
  servings: {
    type: Number,
    required: true,
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  cuisine: {
    type: String,
    required: true
  },
  dietaryType: {
    type: String
  },
  adaptationNotes: [{
    type: String
  }],
  isAdapted: {
    type: Boolean,
    default: false
  },
  keywords: [{
    type: String
  }],
  hasVideoTutorials: {
    type: Boolean,
    default: false
  },
  videoTutorials: [VideoTutorialSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate the slug from the title
RecipeSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Virtual for total time (prep + cook)
RecipeSchema.virtual('totalTime').get(function() {
  return this.prepTime + this.cookTime;
});

const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);

export default Recipe; 