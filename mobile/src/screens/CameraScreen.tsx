import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, textStyles } from '../theme';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { apiService } from '../services/api';

const CameraScreen: React.FC = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera permissions to make this work!'
        );
        return false;
      }
      return true;
    }
    return true;
  };

  const takePicture = async (): Promise<void> => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const pickImage = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const identifyDish = async (): Promise<void> => {
    if (!image) {
      Alert.alert('No Image', 'Please take or select an image first.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiService.identifyDish(image);
      
      // Navigate to recipe screen with the identified recipe ID
      navigation.navigate('Recipe', { recipeId: result.recipeId });
    } catch (error) {
      console.error('Error identifying dish:', error);
      Alert.alert(
        'Identification Failed',
        'We couldn\'t identify the dish. Please try with a clearer image.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Upload Food Photo</Text>
        
        <Text style={styles.subtitle}>
          Take a photo or select one from your gallery to get the recipe
        </Text>

        <Card style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Take Photo"
            onPress={takePicture}
            style={styles.button}
            variant="primary"
            disabled={isLoading}
          />
          
          <Button
            title="Select from Gallery"
            onPress={pickImage}
            style={styles.button}
            variant="outline"
            disabled={isLoading}
          />
        </View>

        {image && (
          <Button
            title="Identify Dish"
            onPress={identifyDish}
            style={styles.identifyButton}
            size="large"
            isLoading={isLoading}
            disabled={isLoading}
          />
        )}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            <Text style={styles.loadingText}>Identifying your dish...</Text>
            <Text style={styles.loadingSubtext}>This may take a moment</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.lightest,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...textStyles.h2,
    marginBottom: spacing.sm,
    color: colors.primary.dark,
    textAlign: 'center',
  },
  subtitle: {
    ...textStyles.body,
    marginBottom: spacing.xl,
    textAlign: 'center',
    color: colors.black,
    opacity: 0.7,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral.light,
  },
  placeholderText: {
    ...textStyles.body,
    color: colors.neutral.dark,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.xl,
  },
  button: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  identifyButton: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  loadingContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    ...textStyles.subtitle,
    marginTop: spacing.md,
    color: colors.primary.main,
  },
  loadingSubtext: {
    ...textStyles.caption,
    color: colors.black,
    opacity: 0.6,
  },
});

export default CameraScreen; 