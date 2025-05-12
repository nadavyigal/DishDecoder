import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, textStyles, layout } from '../theme';
import { apiService } from '../services/api';
import videoService from '../services/videoService';
import { DietaryType, Recipe, Step, VideoTutorial } from '../types/Recipe';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import VideoTutorialCard from '../components/video/VideoTutorialCard';
import VideoTutorialModal from '../components/video/VideoTutorialModal';
import VideoPlayer from '../components/video/VideoPlayer';

type RouteParams = {
  recipeId: string;
};

const RecipeScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { recipeId } = route.params as RouteParams;
  const scrollRef = useRef<ScrollView>(null);
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDietaryType, setSelectedDietaryType] = useState<DietaryType>('none');
  const [isAdapting, setIsAdapting] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Video tutorials state
  const [videoTutorials, setVideoTutorials] = useState<VideoTutorial[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
  const [videoModalVisible, setVideoModalVisible] = useState<boolean>(false);

  useEffect(() => {
    loadRecipe();
    fetchVideoTutorials();
  }, [recipeId]);

  const loadRecipe = async (dietaryType: DietaryType = 'none') => {
    setIsLoading(true);
    try {
      const data = await apiService.getRecipe(recipeId, dietaryType);
      setRecipe(data);
      setSelectedDietaryType(dietaryType);
    } catch (error) {
      console.error('Error loading recipe:', error);
      Alert.alert('Error', 'Failed to load recipe details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVideoTutorials = async () => {
    setIsLoadingVideos(true);
    try {
      const videos = await videoService.getVideoTutorials(recipeId);
      setVideoTutorials(videos);
    } catch (error) {
      console.error('Error fetching video tutorials:', error);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const adaptRecipe = async (dietaryType: DietaryType) => {
    if (dietaryType === selectedDietaryType) return;
    
    setIsAdapting(true);
    try {
      const adaptedRecipe = await apiService.adaptRecipe(recipeId, dietaryType);
      setRecipe(adaptedRecipe);
      setSelectedDietaryType(dietaryType);
    } catch (error) {
      console.error('Error adapting recipe:', error);
      Alert.alert('Error', 'Failed to adapt recipe. Please try again.');
    } finally {
      setIsAdapting(false);
    }
  };

  const handleChangeDiet = (dietaryType: DietaryType) => {
    if (dietaryType === 'none') {
      loadRecipe('none');
    } else {
      adaptRecipe(dietaryType);
    }
  };

  const handleNextStep = () => {
    if (recipe && currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const formatTime = (minutes: number) => {
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

  const handleOpenVideo = (video: VideoTutorial) => {
    setSelectedVideo(video);
    setVideoModalVisible(true);
    
    // Track video view for analytics
    if (recipe?.id) {
      videoService.trackVideoView(video.id);
    }
  };

  const handleCloseVideo = () => {
    setVideoModalVisible(false);
  };

  const renderVideoTutorialItem = ({ item }: { item: VideoTutorial }) => (
    <VideoTutorialCard video={item} onPress={handleOpenVideo} />
  );

  // Determine if the current step has a video tutorial
  const getCurrentStepVideo = () => {
    if (!recipe || !recipe.steps[currentStep].video) return null;
    return recipe.steps[currentStep].video;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>Loading recipe...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Recipe not found.</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.errorButton}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        ref={scrollRef}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipe.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{recipe.name}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Prep Time</Text>
              <Text style={styles.metaValue}>{formatTime(recipe.prepTime)}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Cook Time</Text>
              <Text style={styles.metaValue}>{formatTime(recipe.cookTime)}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Servings</Text>
              <Text style={styles.metaValue}>{recipe.servings}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Difficulty</Text>
              <Text style={styles.metaValue}>{recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}</Text>
            </View>
          </View>

          <Text style={styles.description}>{recipe.description}</Text>

          {/* Video Tutorial Section */}
          {recipe.hasVideoTutorials || videoTutorials.length > 0 ? (
            <View style={styles.videoSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Video Tutorials</Text>
                {videoTutorials.length > 3 && (
                  <TouchableOpacity onPress={() => {
                    // Navigate to a dedicated video tutorials screen
                    // This would be implemented in a real app
                    Alert.alert('All Videos', 'View all video tutorials for this recipe');
                  }}>
                    <Text style={styles.seeAllText}>See All</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {recipe.tutorialPlaylist && (
                <View style={styles.mainTutorialContainer}>
                  <Text style={styles.mainTutorialTitle}>Complete Recipe Tutorial</Text>
                  <TouchableOpacity 
                    style={styles.mainTutorialButton}
                    onPress={() => handleOpenVideo(recipe.tutorialPlaylist!)}
                  >
                    <Image 
                      source={{ 
                        uri: recipe.tutorialPlaylist.thumbnailUrl || 
                          (recipe.tutorialPlaylist.provider === 'youtube' 
                            ? `https://img.youtube.com/vi/${recipe.tutorialPlaylist.videoId}/hqdefault.jpg`
                            : 'https://i.vimeocdn.com/video/' + recipe.tutorialPlaylist.videoId + '_640x360.jpg')
                      }} 
                      style={styles.mainTutorialImage} 
                    />
                    <View style={styles.playButtonOverlay}>
                      <Ionicons name="play-circle" size={60} color="rgba(255,255,255,0.9)" />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              
              <FlatList
                data={videoTutorials}
                renderItem={renderVideoTutorialItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.videoList}
              />
            </View>
          ) : null}

          {/* Dietary Preference Section */}
          <View style={styles.dietarySection}>
            <Text style={styles.sectionTitle}>Dietary Preferences</Text>
            <View style={styles.dietaryButtonsContainer}>
              <Button
                title="Original"
                variant={selectedDietaryType === 'none' ? 'primary' : 'outline'}
                size="small"
                style={styles.dietaryButton}
                onPress={() => handleChangeDiet('none')}
                disabled={isAdapting}
              />
              <Button
                title="Vegetarian"
                variant={selectedDietaryType === 'vegetarian' ? 'primary' : 'outline'}
                size="small"
                style={styles.dietaryButton}
                onPress={() => handleChangeDiet('vegetarian')}
                disabled={isAdapting}
              />
              <Button
                title="Gluten-Free"
                variant={selectedDietaryType === 'gluten-free' ? 'primary' : 'outline'}
                size="small"
                style={styles.dietaryButton}
                onPress={() => handleChangeDiet('gluten-free')}
                disabled={isAdapting}
              />
            </View>
            
            {isAdapting && (
              <View style={styles.adaptingContainer}>
                <ActivityIndicator size="small" color={colors.primary.main} />
                <Text style={styles.adaptingText}>Adapting recipe...</Text>
              </View>
            )}
            
            {recipe.isAdapted && recipe.adaptationNotes && (
              <Card style={styles.adaptationNotes} variant="filled">
                <Text style={styles.adaptationNotesTitle}>Adaptation Notes</Text>
                <Text style={styles.adaptationNotesText}>{recipe.adaptationNotes}</Text>
              </Card>
            )}
          </View>

          {/* Ingredients Section */}
          <View style={styles.ingredientsSection}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <View 
                key={ingredient.id || index} 
                style={[
                  styles.ingredientItem,
                  ingredient.isSubstitution && styles.substitutionItem
                ]}
              >
                <Text style={styles.ingredientText}>
                  <Text style={styles.ingredientAmount}>{ingredient.amount} {ingredient.unit} </Text>
                  {ingredient.name}
                  {ingredient.isSubstitution && ingredient.originalIngredient && (
                    <Text style={styles.substitutionText}> (instead of {ingredient.originalIngredient})</Text>
                  )}
                </Text>
              </View>
            ))}
          </View>

          {/* Steps Section */}
          <View style={styles.stepsSection}>
            <Text style={styles.sectionTitle}>Cooking Steps</Text>
            <Card style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>Step {currentStep + 1} of {recipe.steps.length}</Text>
                {recipe.steps[currentStep].isModified && (
                  <View style={styles.modifiedBadge}>
                    <Text style={styles.modifiedBadgeText}>Modified</Text>
                  </View>
                )}
              </View>
              
              {recipe.steps[currentStep].image && (
                <Image 
                  source={{ uri: recipe.steps[currentStep].image }} 
                  style={styles.stepImage}
                />
              )}
              
              {getCurrentStepVideo() && (
                <View style={styles.stepVideoContainer}>
                  <VideoPlayer 
                    video={getCurrentStepVideo()!} 
                    style={styles.stepVideo}
                  />
                </View>
              )}
              
              <Text style={styles.stepDescription}>
                {recipe.steps[currentStep].description}
              </Text>
              
              <View style={styles.stepNavigation}>
                <Button
                  title="Previous"
                  variant="outline"
                  size="small"
                  onPress={handlePreviousStep}
                  disabled={currentStep === 0}
                  style={styles.navigationButton}
                />
                <Button
                  title="Next"
                  variant="primary"
                  size="small"
                  onPress={handleNextStep}
                  disabled={currentStep === recipe.steps.length - 1}
                  style={styles.navigationButton}
                />
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
      
      {/* Video Tutorial Modal */}
      <VideoTutorialModal 
        visible={videoModalVisible}
        video={selectedVideo}
        onClose={handleCloseVideo}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.lightest,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...textStyles.body,
    marginTop: 16,
    color: colors.neutral.dark,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    ...textStyles.h2,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 16,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.primary.main,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    ...textStyles.h1,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  metaItem: {
    minWidth: '22%',
    marginBottom: 8,
  },
  metaLabel: {
    ...textStyles.caption,
    color: colors.neutral.dark,
    marginBottom: 4,
  },
  metaValue: {
    ...textStyles.body,
    fontWeight: 'bold',
  },
  description: {
    ...textStyles.body,
    marginBottom: 24,
    color: colors.neutral.dark,
  },
  videoSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...textStyles.h2,
    marginBottom: 0,
  },
  seeAllText: {
    ...textStyles.body,
    color: colors.primary.main,
    fontWeight: 'bold',
  },
  mainTutorialContainer: {
    marginBottom: 16,
  },
  mainTutorialTitle: {
    ...textStyles.subtitle,
    marginBottom: 8,
  },
  mainTutorialButton: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  mainTutorialImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoList: {
    paddingBottom: 8,
  },
  dietarySection: {
    marginBottom: 24,
  },
  dietaryButtonsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 16,
  },
  dietaryButton: {
    marginRight: 8,
  },
  adaptingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  adaptingText: {
    ...textStyles.body,
    color: colors.neutral.dark,
    marginLeft: 8,
  },
  adaptationNotes: {
    padding: 16,
    marginBottom: 16,
  },
  adaptationNotesTitle: {
    ...textStyles.subtitle,
    marginBottom: 8,
    color: colors.primary.dark,
  },
  adaptationNotesText: {
    ...textStyles.body,
    color: colors.neutral.dark,
  },
  ingredientsSection: {
    marginBottom: 24,
  },
  ingredientItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.light,
  },
  substitutionItem: {
    backgroundColor: colors.primary.light + '20', // 20% opacity
  },
  ingredientText: {
    ...textStyles.body,
  },
  ingredientAmount: {
    fontWeight: 'bold',
  },
  substitutionText: {
    fontStyle: 'italic',
    color: colors.neutral.dark,
  },
  stepsSection: {
    marginBottom: 24,
  },
  stepCard: {
    padding: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    ...textStyles.body,
    fontWeight: 'bold',
  },
  modifiedBadge: {
    backgroundColor: colors.primary.light,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  modifiedBadgeText: {
    ...textStyles.caption,
    color: colors.primary.dark,
    fontWeight: 'bold',
  },
  stepImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  stepVideoContainer: {
    marginBottom: 16,
  },
  stepVideo: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  stepDescription: {
    ...textStyles.body,
    marginBottom: 24,
  },
  stepNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navigationButton: {
    width: '48%',
  },
});

export default RecipeScreen; 