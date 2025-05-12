import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { DietaryType } from '../../types';
import { getDietaryPreferences } from '../../services/api';
import Text from './Text';
import Card from './Card';
import theme from '../../theme';
import { Feather } from '@expo/vector-icons';

interface DietaryPreferencesProps {
  onSelectDietaryType: (dietaryType: string | null) => void;
  selectedDietaryType: string | null;
  style?: StyleProp<ViewStyle>;
}

const DietaryPreferences: React.FC<DietaryPreferencesProps> = ({
  onSelectDietaryType,
  selectedDietaryType,
  style,
}) => {
  const [dietaryTypes, setDietaryTypes] = useState<DietaryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const loadDietaryTypes = async () => {
      try {
        setIsLoading(true);
        const types = await getDietaryPreferences();
        setDietaryTypes(types);
        setError(null);
      } catch (err) {
        setError('Failed to load dietary preferences');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDietaryTypes();
  }, []);

  const handleDietaryTypeSelect = (dietaryTypeId: string) => {
    onSelectDietaryType(selectedDietaryType === dietaryTypeId ? null : dietaryTypeId);
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const selectedDietaryName = selectedDietaryType 
    ? dietaryTypes.find(type => type.id === selectedDietaryType)?.name 
    : null;

  if (isLoading) {
    return (
      <Card
        style={[styles.container, style]}
        variant="elevated"
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="small" 
            color={theme.colors.accent.primary} 
          />
          <Text style={styles.loadingText}>
            Loading dietary preferences...
          </Text>
        </View>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        style={[styles.container, style]}
        variant="elevated"
      >
        <View style={styles.errorContainer}>
          <Feather 
            name="alert-circle" 
            size={20} 
            color={theme.colors.status.error} 
          />
          <Text 
            style={styles.errorText}
            color={theme.colors.status.error}
          >
            {error}
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card
      style={[styles.container, style]}
      variant="elevated"
    >
      <View style={styles.header}>
        <Text variant="h5" style={styles.title}>
          Dietary Preferences
        </Text>
        
        <TouchableOpacity 
          style={styles.dropdownButton}
          onPress={toggleExpanded}
        >
          <Text 
            color={theme.colors.accent.primary}
            style={styles.selectedText}
          >
            {selectedDietaryName || 'Select preference'}
          </Text>
          <Feather 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={18} 
            color={theme.colors.accent.primary} 
          />
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <ScrollView 
          style={styles.optionsContainer}
          contentContainerStyle={styles.optionsContent}
          showsVerticalScrollIndicator={false}
        >
          {dietaryTypes.map(type => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.optionItem,
                selectedDietaryType === type.id && styles.selectedOption
              ]}
              onPress={() => handleDietaryTypeSelect(type.id)}
            >
              <View style={styles.optionTextContainer}>
                <Text 
                  variant="subtitle" 
                  style={styles.optionTitle}
                >
                  {type.name}
                </Text>
                <Text 
                  variant="bodySmall" 
                  color={theme.colors.text.secondary}
                >
                  {type.description}
                </Text>
              </View>
              {selectedDietaryType === type.id && (
                <Feather 
                  name="check" 
                  size={18} 
                  color={theme.colors.accent.primary} 
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {selectedDietaryType && (
        <View style={styles.infoContainer}>
          <Text 
            variant="subtitle" 
            color={theme.colors.text.accent}
          >
            Recipe adapted for: {selectedDietaryName}
          </Text>
          <Text 
            variant="bodySmall" 
            style={styles.infoDescription}
          >
            {dietaryTypes.find(t => t.id === selectedDietaryType)?.description}
          </Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => onSelectDietaryType(null)}
          >
            <Text 
              variant="button" 
              color={theme.colors.text.primary}
            >
              Reset
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text.primary,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.xs,
    borderRadius: theme.spacing.borderRadius.sm,
    backgroundColor: theme.colors.background.accent,
  },
  selectedText: {
    marginRight: theme.spacing.xs,
  },
  optionsContainer: {
    maxHeight: 200,
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  optionsContent: {
    padding: theme.spacing.xs,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.borderRadius.md,
    marginVertical: 2,
  },
  selectedOption: {
    backgroundColor: theme.colors.background.accent,
  },
  optionTextContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  optionTitle: {
    marginBottom: 2,
  },
  infoContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.amber[50],
    borderRadius: theme.spacing.borderRadius.md,
  },
  infoDescription: {
    marginTop: 4,
    color: theme.colors.text.secondary,
  },
  resetButton: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.spacing.borderRadius.sm,
  },
  loadingContainer: {
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.secondary,
  },
  errorContainer: {
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: theme.colors.status.error + '10', // 10% opacity
  },
  errorText: {
    marginLeft: theme.spacing.sm,
  },
});

export default DietaryPreferences; 