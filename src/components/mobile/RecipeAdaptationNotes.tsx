import React from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Text from './Text';
import theme from '../../theme';
import { Feather } from '@expo/vector-icons';

interface RecipeAdaptationNotesProps {
  adaptationNotes?: string[];
  isAdapted?: boolean;
  style?: StyleProp<ViewStyle>;
}

const RecipeAdaptationNotes: React.FC<RecipeAdaptationNotesProps> = ({
  adaptationNotes,
  isAdapted,
  style,
}) => {
  if (!adaptationNotes || adaptationNotes.length === 0) {
    return null;
  }

  const title = adaptationNotes[0];
  const notes = adaptationNotes.slice(1);

  const renderNoteItem = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.noteItem} key={index}>
      <Feather 
        name="check-circle" 
        size={16} 
        color={isAdapted ? theme.colors.status.success : theme.colors.status.warning} 
        style={styles.noteIcon}
      />
      <Text 
        style={[
          styles.noteText,
          { color: isAdapted ? theme.colors.sage[700] : theme.colors.amber[700] }
        ]}
        variant="bodySmall"
      >
        {item}
      </Text>
    </View>
  );

  return (
    <View 
      style={[
        styles.container,
        isAdapted ? styles.adaptedContainer : styles.warningContainer,
        style,
      ]}
    >
      <View style={styles.header}>
        <Feather 
          name={isAdapted ? "check" : "alert-triangle"} 
          size={20} 
          color={isAdapted ? theme.colors.status.success : theme.colors.status.warning} 
          style={styles.headerIcon}
        />
        <Text
          variant="subtitle"
          style={[
            styles.title,
            { color: isAdapted ? theme.colors.sage[800] : theme.colors.amber[800] }
          ]}
        >
          {title}
        </Text>
      </View>
      
      {notes.length > 0 && (
        <FlatList
          data={notes}
          renderItem={renderNoteItem}
          keyExtractor={(_, index) => `note-${index}`}
          scrollEnabled={false}
          style={styles.notesList}
        />
      )}
      
      {!isAdapted && (
        <View style={styles.warningFooter}>
          <Feather 
            name="info" 
            size={14} 
            color={theme.colors.amber[600]} 
            style={styles.infoIcon}
          />
          <Text
            variant="caption"
            style={styles.warningText}
          >
            This recipe could not be fully adapted. You may want to try a different dietary preference or modify the recipe manually.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  adaptedContainer: {
    backgroundColor: theme.colors.sage[50],
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.status.success,
  },
  warningContainer: {
    backgroundColor: theme.colors.amber[50],
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.status.warning,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  headerIcon: {
    marginRight: theme.spacing.xs,
  },
  title: {
    flex: 1,
  },
  notesList: {
    marginTop: theme.spacing.xs,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  noteIcon: {
    marginRight: theme.spacing.xs,
    marginTop: 2,
  },
  noteText: {
    flex: 1,
  },
  warningFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.amber[200],
  },
  infoIcon: {
    marginRight: theme.spacing.xs,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    color: theme.colors.amber[600],
  },
});

export default RecipeAdaptationNotes; 