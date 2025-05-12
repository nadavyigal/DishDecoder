import { Platform } from 'react-native';

// Font family definitions
const fontFamily = {
  // We'll use system fonts for now, but could be replaced with custom fonts
  regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
  medium: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  bold: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold',
};

// Font size definitions
const fontSize = {
  xxs: 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 36,
  jumbo: 48,
};

// Font weight definitions
const fontWeight = {
  normal: 'normal',
  medium: '500',
  semibold: '600',
  bold: 'bold',
} as const;

// Line height definitions
const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,
};

// Text styles for different purposes
export const textStyles = {
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxxl,
    lineHeight: fontSize.xxxl * lineHeight.tight,
    fontWeight: fontWeight.bold,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    lineHeight: fontSize.xxl * lineHeight.tight,
    fontWeight: fontWeight.bold,
  },
  h3: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * lineHeight.tight,
    fontWeight: fontWeight.bold,
  },
  title: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.normal,
    fontWeight: fontWeight.semibold,
  },
  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.normal,
    fontWeight: fontWeight.medium,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.normal,
    fontWeight: fontWeight.normal,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.normal,
    fontWeight: fontWeight.normal,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.normal,
    fontWeight: fontWeight.normal,
  },
  button: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.normal,
    fontWeight: fontWeight.semibold,
  },
};

export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  textStyles,
};

export default typography; 