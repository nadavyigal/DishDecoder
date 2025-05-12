import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import theme from '../../theme';

type TextVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'subtitle' 
  | 'body' 
  | 'bodySmall'
  | 'caption'
  | 'button';

// Valid React Native font weights
type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'bold' | 'normal';

type TextProps = {
  variant?: TextVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  style?: TextStyle;
  children: React.ReactNode;
};

const fontWeightMap: Record<TextProps['weight'] & string, FontWeight> = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = theme.colors.text.primary,
  align = 'left',
  weight,
  style,
  children,
  ...props
}) => {
  return (
    <RNText
      style={[
        styles.base,
        styles[variant],
        {
          color,
          textAlign: align,
        },
        weight ? { fontWeight: fontWeightMap[weight] } : {},
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
  },
  h1: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: '700' as FontWeight,
    lineHeight: theme.typography.lineHeight['4xl'],
    fontFamily: theme.typography.fontFamily.bold,
  },
  h2: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '700' as FontWeight,
    lineHeight: theme.typography.lineHeight['3xl'],
    fontFamily: theme.typography.fontFamily.bold,
  },
  h3: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700' as FontWeight,
    lineHeight: theme.typography.lineHeight['2xl'],
    fontFamily: theme.typography.fontFamily.bold,
  },
  h4: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700' as FontWeight,
    lineHeight: theme.typography.lineHeight.xl,
    fontFamily: theme.typography.fontFamily.bold,
  },
  h5: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '700' as FontWeight,
    lineHeight: theme.typography.lineHeight.lg,
    fontFamily: theme.typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '500' as FontWeight,
    lineHeight: theme.typography.lineHeight.lg,
    fontFamily: theme.typography.fontFamily.medium,
  },
  body: {
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.lineHeight.base,
  },
  bodySmall: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.sm,
  },
  caption: {
    fontSize: theme.typography.fontSize.xs,
    lineHeight: theme.typography.lineHeight.xs,
  },
  button: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '500' as FontWeight,
    lineHeight: theme.typography.lineHeight.base,
    fontFamily: theme.typography.fontFamily.medium,
  },
});

export default Text; 