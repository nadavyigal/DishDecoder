import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, textStyles } from '../../theme';
import { VideoTutorial } from '../../types/Recipe';

interface VideoTutorialCardProps {
  video: VideoTutorial;
  onPress: (video: VideoTutorial) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const THUMBNAIL_HEIGHT = (CARD_WIDTH * 9) / 16;

const formatDuration = (seconds: number = 0): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const VideoTutorialCard: React.FC<VideoTutorialCardProps> = ({ video, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(video)}
      activeOpacity={0.7}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ 
            uri: video.thumbnailUrl || 
              (video.provider === 'youtube' 
                ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
                : 'https://i.vimeocdn.com/video/' + video.videoId + '_640x360.jpg')
          }}
          style={styles.thumbnail}
        />
        
        <View style={styles.playButton}>
          <Ionicons name="play" size={30} color={colors.white} />
        </View>
        
        {video.duration ? (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{formatDuration(video.duration)}</Text>
          </View>
        ) : null}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>
        <View style={styles.sourceContainer}>
          {video.provider === 'youtube' ? (
            <Ionicons name="logo-youtube" size={16} color={colors.feedback.error} />
          ) : (
            <Ionicons name="logo-vimeo" size={16} color={colors.feedback.info} />
          )}
          <Text style={styles.sourceText}>
            {video.provider === 'youtube' ? 'YouTube' : 'Vimeo'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: THUMBNAIL_HEIGHT,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: colors.white,
    ...textStyles.caption,
    fontWeight: '500',
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    ...textStyles.subtitle,
    marginBottom: 8,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceText: {
    ...textStyles.caption,
    color: colors.neutral.dark,
    marginLeft: 6,
  },
});

export default VideoTutorialCard; 