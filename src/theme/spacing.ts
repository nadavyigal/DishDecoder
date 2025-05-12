import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const spacing = {
  // Base spacing unit
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
  '5xl': 96,
  
  // Screen dimensions
  screenWidth: width,
  screenHeight: height,
  
  // Screen padding
  screenPaddingHorizontal: 16,
  screenPaddingVertical: 16,
  
  // Component specific
  cardPadding: 16,
  buttonPadding: 12,
  inputPadding: 12,
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  // Layout
  header: {
    height: 56,
    paddingHorizontal: 16,
  },
  
  // Image dimensions
  recipeCardHeight: 220,
  recipeThumbnailSize: 80,
  recipeHeroHeight: 240,
};

export default spacing; 