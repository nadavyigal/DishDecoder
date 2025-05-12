import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URL for a sample food image (pizza)
const imageUrl = 'https://img.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg';
const outputPath = path.join(__dirname, 'test-food.jpg');

console.log('Downloading sample food image for testing...');
console.log(`From: ${imageUrl}`);
console.log(`To: ${outputPath}`);

// Download the image
const file = fs.createWriteStream(outputPath);
https.get(imageUrl, response => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download image: HTTP status code ${response.statusCode}`);
    fs.unlinkSync(outputPath); // Remove partial file
    return;
  }

  response.pipe(file);

  file.on('finish', () => {
    file.close();
    console.log('✅ Sample food image downloaded successfully!');
    console.log(`You can now run the test script with: node vision-test.js`);
  });
}).on('error', err => {
  fs.unlinkSync(outputPath); // Remove partial file
  console.error('❌ Error downloading the image:', err.message);
}); 