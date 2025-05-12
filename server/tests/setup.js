// Setup file for integration tests
import { unlinkSync, existsSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(fileURLToPath(new URL('.', import.meta.url)));
const PROJECT_ROOT = resolve(__dirname, '..');

// Create test uploads directory
const testUploadsDir = join(PROJECT_ROOT, 'uploads', 'test');
if (!existsSync(testUploadsDir)) {
  mkdirSync(testUploadsDir, { recursive: true });
}

// Global setup before all tests
global.beforeAll = async () => {
  console.log('Starting integration tests...');
  // You can add database setup or other initialization here
};

// Global teardown after all tests
global.afterAll = async () => {
  console.log('Completed integration tests.');
  // Clean up test resources
  try {
    // Clean up test upload files here if needed
  } catch (error) {
    console.error('Error during test cleanup:', error);
  }
};

// Setup for individual tests
global.beforeEach = async () => {
  // Reset state before each test
};

// Cleanup after individual tests
global.afterEach = async () => {
  // Clean up after each test
}; 