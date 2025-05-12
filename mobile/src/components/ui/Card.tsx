import React from 'react';
import {
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { colors, layout, spacing } from '../../theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: keyof typeof spacing;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'elevated',
  padding = 'md',
  ...rest
}) => {
  const getCardStyle = (): ViewStyle => {
    let variantStyle: ViewStyle = {};
    
    switch (variant) {
      case 'elevated':
        variantStyle = styles.elevatedCard;
        break;
      case 'outlined':
        variantStyle = styles.outlinedCard;
        break;
      case 'filled':
        variantStyle = styles.filledCard;
        break;
    }
    
    return {
      ...variantStyle,
      padding: spacing[padding],
    };
  };
  
  return (
    <View style={[styles.container, getCardStyle(), style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: layout.borderRadius.md,
    overflow: 'hidden',
  },
  elevatedCard: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  outlinedCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral.medium,
  },
  filledCard: {
    backgroundColor: colors.neutral.light,
  },
});

export default Card; 