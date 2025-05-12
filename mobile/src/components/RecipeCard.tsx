import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageStyle,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { RecipeCardProps } from '../types/Recipe';
import { colors, spacing, textStyles, layout } from '../theme';
import Card from './ui/Card';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - spacing.lg * 1.5;

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(recipe);
    }
  };
  
  // Function to format time from minutes to a more readable format
  const formatTime = (minutes?: number): string => {
    if (!minutes) return 'N/A';
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 
        ? `${hours} hr ${remainingMinutes} min` 
        : `${hours} hr`;
    }
  };
  
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Card style={styles.card} padding="none">
        <View style={styles.imageContainer}>
          {recipe.image ? (
            <Image
              source={{ uri: recipe.image }}
              style={styles.image as ImageStyle}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
          
          {recipe.difficulty && (
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>
                {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {recipe.name || 'Unknown Recipe'}
          </Text>
          
          <View style={styles.metaContainer}>
            {totalTime > 0 && (
              <View style={styles.metaItem}>
                <Text style={styles.metaText}>{formatTime(totalTime)}</Text>
              </View>
            )}
            
            {recipe.dietaryInfo?.isVegetarian && (
              <View style={[styles.dietBadge, { backgroundColor: colors.secondary.light }]}>
                <Text style={styles.dietBadgeText}>Veg</Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    margin: spacing.sm,
    overflow: 'hidden',
  } as ViewStyle,
  imageContainer: {
    position: 'relative',
    height: 150,
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  placeholderImage: {
    backgroundColor: colors.neutral.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...textStyles.body,
    color: colors.neutral.dark,
  },
  contentContainer: {
    padding: spacing.md,
  },
  title: {
    ...textStyles.subtitle,
    marginBottom: spacing.xs,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    marginRight: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...textStyles.caption,
    color: colors.black,
    opacity: 0.7,
  },
  difficultyBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: layout.borderRadius.sm,
  },
  difficultyText: {
    ...textStyles.caption,
    color: colors.white,
    fontWeight: 'bold',
  },
  dietBadge: {
    backgroundColor: colors.secondary.light,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: layout.borderRadius.sm,
  },
  dietBadgeText: {
    ...textStyles.caption,
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default RecipeCard; 