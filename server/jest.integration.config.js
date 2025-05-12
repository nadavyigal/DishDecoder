import baseConfig from './jest.config.js';

export default {
  ...baseConfig,
  testMatch: ['**/tests/integration/**/*.js'],
  setupFilesAfterEnv: ['./tests/setup.js'],
  testTimeout: 30000, // Integration tests may take longer
}; 