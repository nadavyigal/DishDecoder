import { logger } from './logger.js';

// AI Logger provides specialized logging functions for AI operations
const aiLogger = {
  /**
   * Log AI prediction results with detailed information
   * @param {string} operation - The AI operation being performed
   * @param {Object} predictionData - The prediction result data
   * @param {number} confidence - Confidence score (0-100)
   * @param {boolean} validated - Whether prediction was validated against database
   */
  prediction: (operation, predictionData, confidence, validated = false) => {
    logger.info({
      message: `AI Prediction: ${operation}`,
      operation,
      prediction: predictionData,
      confidence,
      validated,
      timestamp: new Date().toISOString()
    });
  },
  
  /**
   * Log AI prediction failures with error details
   * @param {string} operation - The AI operation being performed
   * @param {Error} error - Error object or message
   * @param {Object} requestData - Original request data that caused the error
   */
  error: (operation, error, requestData = {}) => {
    logger.error({
      message: `AI Error: ${operation} - ${error.message || error}`,
      operation,
      error: error.stack || error.message || error,
      requestData,
      timestamp: new Date().toISOString()
    });
  },
  
  /**
   * Log fallback operations when primary AI fails
   * @param {string} operation - The AI operation being performed
   * @param {string} fallbackType - Type of fallback used
   * @param {Object} result - Result of the fallback operation
   */
  fallback: (operation, fallbackType, result) => {
    logger.warn({
      message: `AI Fallback: ${operation} using ${fallbackType}`,
      operation,
      fallbackType,
      result,
      timestamp: new Date().toISOString()
    });
  },
  
  /**
   * Log validation results when comparing AI predictions to database
   * @param {string} operation - The validation operation
   * @param {string} predictionId - The ID of the prediction being validated
   * @param {Object} validationResult - Results of the validation
   */
  validation: (operation, predictionId, validationResult) => {
    logger.info({
      message: `AI Validation: ${operation} for prediction ${predictionId}`,
      operation,
      predictionId,
      validationResult,
      timestamp: new Date().toISOString()
    });
  },
  
  /**
   * Log performance metrics for AI operations
   * @param {string} operation - The AI operation
   * @param {number} responseTime - Time taken in milliseconds
   * @param {Object} metadata - Additional metadata
   */
  performance: (operation, responseTime, metadata = {}) => {
    logger.debug({
      message: `AI Performance: ${operation} took ${responseTime}ms`,
      operation,
      responseTime,
      metadata,
      timestamp: new Date().toISOString()
    });
  }
};

export default aiLogger; 