import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import type { Recipe } from '../../types';
import RecipeStep from './RecipeStep';
import { Clock, Users } from 'lucide-react';

interface RecipeViewerProps {
  recipe: Recipe;
}

const RecipeViewer: React.FC<RecipeViewerProps> = ({ recipe }) => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.title}</Text>
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <Clock size={20} color="#FF6B35" />
            <Text style={styles.metaText}>
              {recipe.prepTime + recipe.cookTime} min
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={20} color="#FF6B35" />
            <Text style={styles.metaText}>
              Serves {recipe.servings}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.ingredients}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientCard}>
              <Text style={styles.ingredientName}>{ingredient.name}</Text>
              <Text style={styles.ingredientAmount}>
                {ingredient.quantity} {ingredient.unit}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <Text style={[styles.sectionTitle, styles.stepsTitle]}>Steps</Text>
      <ScrollView 
        style={styles.steps}
        showsVerticalScrollIndicator={false}
      >
        {recipe.steps.map((step) => (
          <Pressable
            key={step.id}
            onPress={() => setActiveStep(step.id)}
          >
            <RecipeStep
              step={step}
              isActive={step.id === activeStep}
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#4B5563',
    fontSize: 14,
  },
  ingredients: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  ingredientCard: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 120,
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  ingredientAmount: {
    fontSize: 12,
    color: '#6B7280',
  },
  stepsTitle: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  steps: {
    flex: 1,
  },
});

export default RecipeViewer;