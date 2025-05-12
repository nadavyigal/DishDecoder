import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import type { Step } from '../../types';

interface RecipeStepProps {
  step: Step;
  isActive: boolean;
}

const { width } = Dimensions.get('window');

const RecipeStep: React.FC<RecipeStepProps> = ({ step, isActive }) => {
  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{step.id}</Text>
      </View>
      <Image
        source={{ uri: step.imageUrl || 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>{step.instruction}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  activeContainer: {
    borderColor: '#FF6B35',
    borderWidth: 2,
  },
  stepNumber: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF6B35',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
  },
  instructionContainer: {
    padding: 16,
  },
  instruction: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1F2937',
  },
});

export default RecipeStep;