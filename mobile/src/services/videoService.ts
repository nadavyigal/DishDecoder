import { VideoTutorial } from '../types/Recipe';
import { apiService } from './api';

// This service would integrate with the YouTube and Vimeo APIs in a real app
// For now, we're using mock implementations with sample data

/**
 * Get video tutorials for a recipe
 * @param recipeId - The ID of the recipe
 */
export const getVideoTutorials = async (recipeId: string): Promise<VideoTutorial[]> => {
  try {
    // In a real app, you would fetch from your API which would retrieve the videos from YouTube/Vimeo
    const response = await apiService.get(`/recipes/${recipeId}/videos`);
    return response.videos;
  } catch (error) {
    console.error('Error fetching video tutorials:', error);
    
    // Return sample data for demonstration
    return getSampleVideoTutorials(recipeId);
  }
};

/**
 * Get a single video tutorial by ID
 * @param videoId - The ID of the video tutorial
 */
export const getVideoTutorial = async (videoId: string): Promise<VideoTutorial | null> => {
  try {
    // In a real app, you would fetch from your API
    const response = await apiService.get(`/videos/${videoId}`);
    return response.video;
  } catch (error) {
    console.error('Error fetching video tutorial:', error);
    
    // Return null or sample data for demonstration
    const allSampleVideos = getSampleVideoTutorials('sample');
    return allSampleVideos.find(v => v.id === videoId) || null;
  }
};

/**
 * Track video view (for analytics)
 * @param videoId - The ID of the video
 * @param userId - The ID of the user
 * @param watchDuration - Duration watched in seconds
 */
export const trackVideoView = async (
  videoId: string, 
  userId: string = 'anonymous',
  watchDuration: number = 0
): Promise<void> => {
  try {
    // In a real app, you would post to your analytics endpoint
    await apiService.post('/analytics/video-views', {
      videoId,
      userId,
      watchDuration,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error tracking video view:', error);
    // Silently fail for analytics - don't disrupt user experience
  }
};

/**
 * Get video metadata from YouTube
 * @param youtubeId - YouTube video ID
 */
export const getYouTubeMetadata = async (youtubeId: string): Promise<any> => {
  try {
    // In a real app, you would use the YouTube API via your backend
    // const response = await apiService.get(`/youtube/videos/${youtubeId}`);
    // return response;
    
    // Mock implementation
    return {
      title: 'YouTube Video',
      duration: 300, // 5 minutes
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      channelTitle: 'Food Channel',
      publishedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    throw error;
  }
};

/**
 * Get video metadata from Vimeo
 * @param vimeoId - Vimeo video ID
 */
export const getVimeoMetadata = async (vimeoId: string): Promise<any> => {
  try {
    // In a real app, you would use the Vimeo API via your backend
    // const response = await apiService.get(`/vimeo/videos/${vimeoId}`);
    // return response;
    
    // Mock implementation
    return {
      title: 'Vimeo Video',
      duration: 240, // 4 minutes
      thumbnailUrl: `https://i.vimeocdn.com/video/${vimeoId}_640x360.jpg`,
      userName: 'Food Creator',
      uploadDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Vimeo metadata:', error);
    throw error;
  }
};

/**
 * Get step-by-step video tutorials for a recipe
 * @param recipeId - The ID of the recipe
 */
export const getStepByStepTutorials = async (recipeId: string): Promise<VideoTutorial[]> => {
  try {
    // In a real app, you would fetch from your API
    const response = await apiService.get(`/recipes/${recipeId}/step-videos`);
    return response.videos;
  } catch (error) {
    console.error('Error fetching step-by-step tutorials:', error);
    
    // Return sample data filtered to only include step-by-step videos
    const allVideos = getSampleVideoTutorials(recipeId);
    return allVideos.filter(video => 
      video.title.toLowerCase().includes('step') || 
      video.title.toLowerCase().includes('how to')
    );
  }
};

// Sample data helper
const getSampleVideoTutorials = (recipeId: string): VideoTutorial[] => {
  return [
    {
      id: '1',
      title: 'How to Make Perfect Pasta - Full Recipe Tutorial',
      provider: 'youtube',
      videoId: 'MqU_S3Fh9LE',
      thumbnailUrl: 'https://img.youtube.com/vi/MqU_S3Fh9LE/hqdefault.jpg',
      duration: 423, // 7:03
    },
    {
      id: '2',
      title: 'Pasta Sauce Technique - Professional Chef Tips',
      provider: 'youtube',
      videoId: '6vPA0REF-m4',
      thumbnailUrl: 'https://img.youtube.com/vi/6vPA0REF-m4/hqdefault.jpg',
      duration: 237, // 3:57
    },
    {
      id: '3',
      title: 'Italian Cooking Secrets - Pasta Al Dente',
      provider: 'vimeo',
      videoId: '76979871',
      duration: 185, // 3:05
    },
    {
      id: '4',
      title: 'Perfect Pasta Plating',
      provider: 'youtube',
      videoId: 'C-fDBUJC-Qo',
      thumbnailUrl: 'https://img.youtube.com/vi/C-fDBUJC-Qo/hqdefault.jpg',
      duration: 312, // 5:12
    },
    {
      id: '5',
      title: 'How to Make Pasta from Scratch',
      provider: 'youtube',
      videoId: 'DgZkm-fgwuQ',
      thumbnailUrl: 'https://img.youtube.com/vi/DgZkm-fgwuQ/hqdefault.jpg',
      duration: 595, // 9:55
    },
    {
      id: '6',
      title: 'Understanding Pasta Textures',
      provider: 'vimeo',
      videoId: '537231789',
      duration: 246, // 4:06
    }
  ];
};

const videoService = {
  getVideoTutorials,
  getVideoTutorial,
  trackVideoView,
  getYouTubeMetadata,
  getVimeoMetadata,
  getStepByStepTutorials
};

export default videoService; 