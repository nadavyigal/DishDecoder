import React, { useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  Text, 
  Dimensions, 
  Platform,
  TouchableOpacity
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import VimeoPlayer from 'react-native-vimeo-iframe';
import { colors, textStyles } from '../../theme';
import { VideoTutorial } from '../../types/Recipe';

interface VideoPlayerProps {
  video: VideoTutorial;
  style?: object;
  autoplay?: boolean;
  onError?: (error: string) => void;
}

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = (width * 9) / 16; // 16:9 aspect ratio

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  video, 
  style, 
  autoplay = false,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  
  // For handling orientation changes
  const [playerWidth, setPlayerWidth] = useState(width);
  const [playerHeight, setPlayerHeight] = useState(VIDEO_HEIGHT);
  
  const onReady = useCallback(() => {
    setIsLoading(false);
  }, []);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setIsPlaying(false);
    }
  }, []);

  const handleError = useCallback((err: string) => {
    console.error('Video playback error:', err);
    setError('Failed to load video. Please try again later.');
    setIsLoading(false);
    if (onError) onError(err);
  }, [onError]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
  };

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={styles.loadingText}>Loading video...</Text>
        </View>
      )}
      
      {video.provider === 'youtube' ? (
        <YoutubePlayer
          height={playerHeight}
          width={playerWidth}
          videoId={video.videoId}
          play={isPlaying}
          onChangeState={onStateChange}
          onReady={onReady}
          onError={handleError}
          initialPlayerParams={{
            preventFullScreen: false,
            cc_lang_pref: 'en',
            showClosedCaptions: true,
          }}
        />
      ) : (
        <VimeoPlayer
          videoId={video.videoId}
          params={'autoplay=' + (isPlaying ? '1' : '0')}
          style={{
            height: playerHeight,
            width: playerWidth,
          }}
          onReady={onReady}
          onError={handleError}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: VIDEO_HEIGHT,
    backgroundColor: colors.black,
    borderRadius: 8,
    overflow: 'hidden',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    color: colors.white,
    ...textStyles.bodySmall,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: colors.white,
    ...textStyles.body,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  retryText: {
    color: colors.white,
    ...textStyles.button,
  },
});

export default VideoPlayer; 