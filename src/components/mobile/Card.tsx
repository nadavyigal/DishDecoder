import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import theme from '../../theme';

// Define valid spacing keys that return numbers
type SpacingKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: SpacingKey | number;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  variant = 'default',
  padding = 'md',
}) => {
  // Get numeric padding value
  const paddingValue = typeof padding === 'number'
    ? padding
    : theme.spacing[padding];
  
  return (
    <View 
      style={[
        styles.card,
        styles[variant],
        { padding: paddingValue as number },
        style,
      ]}
    >
      {children}
    </View>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  style 
}) => {
  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  children, 
  style 
}) => {
  return (
    <View style={[styles.header, style]}>
      {children}
    </View>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const CardFooter: React.FC<CardFooterProps> = ({ 
  children, 
  style 
}) => {
  return (
    <View style={[styles.footer, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.spacing.borderRadius.lg,
    backgroundColor: theme.colors.background.primary,
    overflow: 'hidden',
  },
  default: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
  },
  content: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    paddingBottom: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
});

export default Card; 