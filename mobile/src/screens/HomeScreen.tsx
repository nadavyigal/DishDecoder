import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, textStyles } from '../theme';
import { Recipe } from '../types/Recipe';
import RecipeCard from '../components/RecipeCard';
import { apiService } from '../services/api';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecipes(recipes);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = recipes.filter((recipe) => 
        recipe.name.toLowerCase().includes(lowercaseQuery) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        recipe.ingredients.some(ingredient => 
          ingredient.name.toLowerCase().includes(lowercaseQuery)
        )
      );
      setFilteredRecipes(filtered);
    }
  }, [recipes, searchQuery]);

  const loadRecipes = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getRecipes();
      setRecipes(data);
      setFilteredRecipes(data);
    } catch (error) {
      console.error('Error loading recipes:', error);
      Alert.alert('Error', 'Failed to load recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipePress = (recipe: Partial<Recipe>) => {
    if (recipe.id) {
      navigation.navigate('Recipe', { recipeId: recipe.id });
    }
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <RecipeCard recipe={item} onPress={handleRecipePress} />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery.trim() !== ''
          ? 'No recipes match your search.'
          : 'No recipes available.'}
      </Text>
      {searchQuery.trim() !== '' && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Text style={styles.clearSearchText}>Clear search</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const handleRefresh = () => {
    loadRecipes();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DishDecoder</Text>
        <Text style={styles.subtitle}>Discover delicious recipes</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.neutral.dark}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={styles.loadingText}>Loading recipes...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.recipeList}
          ListEmptyComponent={renderEmptyList}
          onRefresh={handleRefresh}
          refreshing={isLoading}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}

      <TouchableOpacity 
        style={styles.cameraButton}
        onPress={() => navigation.navigate('Camera')}
      >
        <Text style={styles.cameraButtonText}>📷</Text>
      </TouchableOpacity>
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: spacing.lg,
    ...textStyles.body,
    borderWidth: 1,
    borderColor: colors.neutral.medium,
  },
  clearButton: {
    position: 'absolute',
    right: spacing.xl,
    padding: spacing.xs,
  },
  clearButtonText: {
    fontSize: 16,
    color: colors.neutral.dark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...textStyles.subtitle,
    marginTop: spacing.md,
    color: colors.primary.main,
  },
  recipeList: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xxl,
  },
  emptyText: {
    ...textStyles.subtitle,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  clearSearchText: {
    ...textStyles.button,
    color: colors.primary.main,
  },
  cameraButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cameraButtonText: {
    fontSize: 24,
  },
});

export default HomeScreen; 