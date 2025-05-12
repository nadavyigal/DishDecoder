import React from 'react';
import {
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, layout, textStyles } from '../../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  style,
  textStyle,
  onPress,
  disabled,
  ...rest
}) => {
  const getButtonStyles = (): ViewStyle => {
    let variantStyle: ViewStyle = {};
    
    switch (variant) {
      case 'primary':
        variantStyle = styles.primaryButton;
        break;
      case 'secondary':
        variantStyle = styles.secondaryButton;
        break;
      case 'outline':
        variantStyle = styles.outlineButton;
        break;
      case 'text':
        variantStyle = styles.textButton;
        break;
    }
    
    let sizeStyle: ViewStyle = {};
    
    switch (size) {
      case 'small':
        sizeStyle = styles.smallButton;
        break;
      case 'medium':
        sizeStyle = styles.mediumButton;
        break;
      case 'large':
        sizeStyle = styles.largeButton;
        break;
    }
    
    return {
      ...variantStyle,
      ...sizeStyle,
      ...(disabled && styles.disabledButton),
    };
  };
  
  const getTextStyles = (): TextStyle => {
    let textStyleVariant: TextStyle = {};
    
    switch (variant) {
      case 'primary':
        textStyleVariant = styles.primaryText;
        break;
      case 'secondary':
        textStyleVariant = styles.secondaryText;
        break;
      case 'outline':
        textStyleVariant = styles.outlineText;
        break;
      case 'text':
        textStyleVariant = styles.textButtonText;
        break;
    }
    
    let textSizeStyle: TextStyle = {};
    
    switch (size) {
      case 'small':
        textSizeStyle = styles.smallText;
        break;
      case 'medium':
        textSizeStyle = styles.mediumText;
        break;
      case 'large':
        textSizeStyle = styles.largeText;
        break;
    }
    
    return {
      ...textStyleVariant,
      ...textSizeStyle,
      ...(disabled && styles.disabledText),
    };
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'text' ? colors.primary.main : colors.white} 
        />
      ) : (
        <Text style={[getTextStyles(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Variant styles
  primaryButton: {
    backgroundColor: colors.primary.main,
    borderRadius: layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: colors.secondary.main,
    borderRadius: layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    backgroundColor: colors.transparent,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    backgroundColor: colors.transparent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  
  // Size styles
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  
  // Text styles
  primaryText: {
    ...textStyles.button,
    color: colors.white,
  },
  secondaryText: {
    ...textStyles.button,
    color: colors.white,
  },
  outlineText: {
    ...textStyles.button,
    color: colors.primary.main,
  },
  textButtonText: {
    ...textStyles.button,
    color: colors.primary.main,
  },
  disabledText: {
    opacity: 0.7,
  },
  
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});

export default Button; 