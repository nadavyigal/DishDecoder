import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, textStyles } from '../theme';
import { Recipe } from '../types/Recipe';
import RecipeCard from '../components/RecipeCard';

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation();
  
  // Dummy data for favorites
  const [favorites, setFavorites] = useState<Recipe[]>([
    {
      id: '1',
      name: 'Vegetable Pasta Primavera',
      description: 'Light, fresh pasta with seasonal vegetables.',
      image: 'https://source.unsplash.com/random/300x200/?pasta',
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      difficulty: 'easy',
      ingredients: [],
      steps: [],
      tags: ['Italian', 'Pasta', 'Vegetarian'],
      dietaryInfo: {
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        isDairyFree: false,
        isKeto: false,
        isPaleo: false,
      },
    },
    {
      id: '2',
      name: 'Thai Coconut Curry',
      description: 'Creamy coconut curry with spices and vegetables.',
      image: 'https://source.unsplash.com/random/300x200/?curry',
      prepTime: 20,
      cookTime: 30,
      servings: 4,
      difficulty: 'medium',
      ingredients: [],
      steps: [],
      tags: ['Thai', 'Curry', 'Spicy'],
      dietaryInfo: {
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isDairyFree: true,
        isKeto: false,
        isPaleo: false,
      },
    },
    {
      id: '3',
      name: 'Berry Smoothie Bowl',
      description: 'Refreshing breakfast bowl with mixed berries and toppings.',
      image: 'https://source.unsplash.com/random/300x200/?smoothie',
      prepTime: 10,
      cookTime: 0,
      servings: 1,
      difficulty: 'easy',
      ingredients: [],
      steps: [],
      tags: ['Breakfast', 'Smoothie', 'Healthy'],
      dietaryInfo: {
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isDairyFree: false,
        isKeto: false,
        isPaleo: false,
      },
    },
  ]);

  const handleRecipePress = (recipe: Partial<Recipe>) => {
    if (recipe.id) {
      navigation.navigate('Recipe', { recipeId: recipe.id });
    }
  };

  const handleRemoveFavorite = (recipeId: string) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this recipe from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setFavorites(favorites.filter(recipe => recipe.id !== recipeId));
          }
        },
      ]
    );
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <View style={styles.recipeItemContainer}>
      <RecipeCard recipe={item} onPress={handleRecipePress} />
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>Your saved recipes</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptyText}>
            Start adding recipes to your favorites to see them here.
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>Browse Recipes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.recipeList}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.lightest,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...textStyles.h1,
    color: colors.primary.dark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.black,
    opacity: 0.7,
    marginBottom: spacing.md,
  },
  recipeList: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  recipeItemContainer: {
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.feedback.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...textStyles.h2,
    color: colors.primary.dark,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...textStyles.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
    color: colors.neutral.dark,
  },
  browseButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 25,
  },
  browseButtonText: {
    ...textStyles.button,
    color: colors.white,
  },
});

export default FavoritesScreen; 