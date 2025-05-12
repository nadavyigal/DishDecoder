import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: {
    regular: 'Avenir-Book',
    medium: 'Avenir-Medium',
    bold: 'Avenir-Heavy',
    light: 'Avenir-Light',
  },
  android: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
    light: 'Roboto-Light',
  },
  default: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },
});

export const typography = {
  fontFamily,
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 30,
    '2xl': 32,
    '3xl': 36,
    '4xl': 40,
    '5xl': 56,
  },
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
    widest: 1.6,
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export default typography; 