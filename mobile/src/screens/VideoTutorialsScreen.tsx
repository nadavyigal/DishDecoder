import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, textStyles } from '../theme';
import { VideoTutorial } from '../types/Recipe';
import VideoTutorialCard from '../components/video/VideoTutorialCard';
import VideoTutorialModal from '../components/video/VideoTutorialModal';
import videoService from '../services/videoService';

type RouteParams = {
  recipeId: string;
  recipeName: string;
};

const { width } = Dimensions.get('window');

const VideoTutorialsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { recipeId, recipeName } = route.params as RouteParams;

  const [videoTutorials, setVideoTutorials] = useState<VideoTutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [categories, setCategories] = useState<string[]>(['All', 'Step-by-step', 'Techniques', 'Tips']);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchVideoTutorials();
  }, [recipeId]);

  const fetchVideoTutorials = async () => {
    setIsLoading(true);
    try {
      const videos = await videoService.getVideoTutorials(recipeId);
      setVideoTutorials(videos);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching video tutorials:', error);
      setIsLoading(false);
    }
  };

  const handleOpenVideo = (video: VideoTutorial) => {
    setSelectedVideo(video);
    setVideoModalVisible(true);
    
    // Track video view for analytics
    videoService.trackVideoView(video.id);
  };

  const handleCloseVideo = () => {
    setVideoModalVisible(false);
  };

  const filteredVideos = selectedCategory === 'All' 
    ? videoTutorials 
    : videoTutorials.filter(video => video.title.includes(selectedCategory));

  const renderVideoItem = ({ item }: { item: VideoTutorial }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => handleOpenVideo(item)}
      activeOpacity={0.8}
    >
      <VideoTutorialCard video={item} onPress={handleOpenVideo} />
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.categoryTextActive
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.neutral.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Tutorials</Text>
        <View style={styles.headerRight} />
      </View>

      <Text style={styles.recipeName}>{recipeName}</Text>

      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={styles.loadingText}>Loading video tutorials...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVideos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.videosList}
          numColumns={width >= 768 ? 2 : 1} // Grid for tablets, list for phones
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="videocam-outline" size={64} color={colors.neutral.light} />
              <Text style={styles.emptyText}>No video tutorials available</Text>
            </View>
          }
        />
      )}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.light,
    backgroundColor: colors.white,
  },
  headerTitle: {
    ...textStyles.h3,
    color: colors.neutral.dark,
  },
  headerRight: {
    width: 24,
  },
  backButton: {
    padding: 4,
  },
  recipeName: {
    ...textStyles.h2,
    padding: 16,
    paddingBottom: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.neutral.light,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary.main,
  },
  categoryText: {
    ...textStyles.body,
    color: colors.neutral.dark,
  },
  categoryTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    ...textStyles.body,
    marginTop: 16,
    color: colors.neutral.dark,
  },
  videosList: {
    padding: 16,
    paddingTop: 8,
  },
  videoCard: {
    marginBottom: 16,
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    ...textStyles.body,
    marginTop: 16,
    color: colors.neutral.dark,
    textAlign: 'center',
  },
});

export default VideoTutorialsScreen; 