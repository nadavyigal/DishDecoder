import React, { useState, useCallback } from 'react';
import { 
  Modal, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, textStyles } from '../../theme';
import { VideoTutorial } from '../../types/Recipe';
import VideoPlayer from './VideoPlayer';

interface VideoTutorialModalProps {
  visible: boolean;
  video: VideoTutorial | null;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const VideoTutorialModal: React.FC<VideoTutorialModalProps> = ({ 
  visible, 
  video, 
  onClose 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenChange = useCallback((isFullscreen: boolean) => {
    setIsFullscreen(isFullscreen);
    
    // Hide status bar in fullscreen mode
    if (Platform.OS === 'ios') {
      StatusBar.setHidden(isFullscreen);
    }
  }, []);

  const renderContent = () => {
    if (!video) return null;

    return (
      <View style={styles.content}>
        <VideoPlayer 
          video={video} 
          autoplay={true}
          style={isFullscreen ? styles.fullscreenPlayer : styles.player}
        />
        
        {!isFullscreen && (
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{video.title}</Text>
            <View style={styles.sourceContainer}>
              {video.provider === 'youtube' ? (
                <Ionicons name="logo-youtube" size={18} color={colors.feedback.error} />
              ) : (
                <Ionicons name="logo-vimeo" size={18} color={colors.feedback.info} />
              )}
              <Text style={styles.sourceText}>
                {video.provider === 'youtube' ? 'YouTube' : 'Vimeo'}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" />
      
      <SafeAreaView style={styles.container}>
        {!isFullscreen && (
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={28} color={colors.neutral.dark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Video Tutorial</Text>
            <View style={styles.spacer} />
          </View>
        )}
        
        {renderContent()}
      </SafeAreaView>
    </Modal>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.light,
  },
  headerTitle: {
    ...textStyles.h3,
    color: colors.neutral.dark,
  },
  closeButton: {
    padding: 4,
  },
  spacer: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  player: {
    width: width,
    height: width * 9 / 16,
  },
  fullscreenPlayer: {
    width: height, // When in landscape, height becomes width
    height: width, // When in landscape, width becomes height
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    ...textStyles.h2,
    marginBottom: 8,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceText: {
    ...textStyles.body,
    color: colors.neutral.dark,
    marginLeft: 8,
  },
});

export default VideoTutorialModal; 