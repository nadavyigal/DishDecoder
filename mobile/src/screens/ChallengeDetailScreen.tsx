import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  getChallengeById,
  joinChallenge,
  leaveChallenge,
  getPosts
} from '../services/communityService';
import { getCurrentUser } from '../services/firebase';
import { Challenge, Post } from '../types/Community';
import { colors, textStyles } from '../theme';

const { width } = Dimensions.get('window');

type RouteParams = {
  ChallengeDetail: {
    challengeId: string;
  };
};

const ChallengeDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'ChallengeDetail'>>();
  const { challengeId } = route.params;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challengePosts, setChallengePosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [userJoined, setUserJoined] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  const fetchChallenge = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedChallenge = await getChallengeById(challengeId);
      
      if (fetchedChallenge) {
        setChallenge(fetchedChallenge);
        
        // Check if current user has joined this challenge
        const currentUser = getCurrentUser();
        if (currentUser && fetchedChallenge.participants.includes(currentUser.uid)) {
          setUserJoined(true);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching challenge:', error);
      setLoading(false);
    }
  }, [challengeId]);

  const fetchChallengePosts = useCallback(async () => {
    try {
      setPostsLoading(true);
      
      // Get posts for this challenge
      const { posts } = await getPosts(undefined, 10, false, challengeId);
      setChallengePosts(posts);
      
      setPostsLoading(false);
    } catch (error) {
      console.error('Error fetching challenge posts:', error);
      setPostsLoading(false);
    }
  }, [challengeId]);

  useEffect(() => {
    fetchChallenge();
    fetchChallengePosts();
  }, [fetchChallenge, fetchChallengePosts]);

  const handleJoinChallenge = async () => {
    try {
      setJoinLoading(true);
      await joinChallenge(challengeId);
      setUserJoined(true);
      fetchChallenge(); // Refresh challenge data
      setJoinLoading(false);
    } catch (error) {
      console.error('Error joining challenge:', error);
      setJoinLoading(false);
    }
  };

  const handleLeaveChallenge = async () => {
    try {
      setJoinLoading(true);
      await leaveChallenge(challengeId);
      setUserJoined(false);
      fetchChallenge(); // Refresh challenge data
      setJoinLoading(false);
    } catch (error) {
      console.error('Error leaving challenge:', error);
      setJoinLoading(false);
    }
  };

  const handleShare = async () => {
    if (!challenge) return;
    
    try {
      await Share.share({
        message: `Join me in the "${challenge.title}" cooking challenge on DishDecoder! Let's cook together!`,
        // In a real app, you might include a deep link URL here
      });
    } catch (error) {
      console.error('Error sharing challenge:', error);
    }
  };

  const navigateToCreatePost = () => {
    // Navigate to camera/post creation screen with challenge context
    navigation.navigate('Camera', { challengeId });
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
    >
      <Image source={{ uri: item.photoURL }} style={styles.postImage} />
      <View style={styles.postInfo}>
        <View style={styles.postUser}>
          <Image
            source={{ uri: item.userPhotoURL || 'https://via.placeholder.com/40' }}
            style={styles.userAvatar}
          />
          <Text style={styles.userName}>{item.userName}</Text>
        </View>
        <Text style={styles.postCaption} numberOfLines={2}>
          {item.caption}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  if (!challenge) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Challenge not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const startDate = challenge.startDate.toDate();
  const endDate = challenge.endDate.toDate();
  const now = new Date();
  const isActive = now >= startDate && now <= endDate;
  const isUpcoming = now < startDate;
  const isCompleted = now > endDate;
  
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const progress = isCompleted
    ? 100
    : Math.round(((now.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.neutral.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Challenge Details</Text>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
      >
        <Image source={{ uri: challenge.coverImageURL }} style={styles.coverImage} />
        
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          {challenge.featured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.challengeDescription}>{challenge.description}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={18} color={colors.neutral.dark} />
            <Text style={styles.statText}>{challenge.participants.length} participants</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="image-outline" size={18} color={colors.neutral.dark} />
            <Text style={styles.statText}>{challenge.postCount} posts</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={18} color={colors.neutral.dark} />
            <Text style={styles.statText}>
              {isActive
                ? `${daysLeft} days left`
                : isUpcoming
                  ? `Starts in ${Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days`
                  : 'Completed'}
            </Text>
          </View>
        </View>
        
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Start Date</Text>
          <Text style={styles.dateValue}>{startDate.toDateString()}</Text>
          
          <Text style={styles.dateLabel}>End Date</Text>
          <Text style={styles.dateValue}>{endDate.toDateString()}</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {isCompleted
              ? 'Challenge completed'
              : isUpcoming
                ? 'Challenge not started yet'
                : `${progress}% completed`}
          </Text>
        </View>
        
        {challenge.rewards && (
          <View style={styles.rewardsContainer}>
            <Text style={styles.rewardsTitle}>Rewards</Text>
            <Text style={styles.rewardsText}>{challenge.rewards}</Text>
          </View>
        )}
        
        {userJoined ? (
          <View style={styles.participationContainer}>
            <Text style={styles.participationText}>
              {isActive
                ? 'You are participating in this challenge!'
                : isUpcoming
                  ? 'You are registered for this challenge!'
                  : 'You participated in this challenge!'}
            </Text>
            
            {isActive && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={navigateToCreatePost}
              >
                <Text style={styles.actionButtonText}>Add Your Creation</Text>
              </TouchableOpacity>
            )}
            
            {!isCompleted && (
              <TouchableOpacity
                style={styles.leaveButton}
                onPress={handleLeaveChallenge}
                disabled={joinLoading}
              >
                {joinLoading ? (
                  <ActivityIndicator size="small" color={colors.feedback.error} />
                ) : (
                  <Text style={styles.leaveButtonText}>Leave Challenge</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.joinContainer}>
            <TouchableOpacity
              style={[
                styles.joinButton,
                (isCompleted || joinLoading) && styles.joinButtonDisabled
              ]}
              onPress={handleJoinChallenge}
              disabled={isCompleted || joinLoading}
            >
              {joinLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.joinButtonText}>
                  {isCompleted ? 'Challenge Ended' : 'Join Challenge'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>Challenge Posts</Text>
          
          {postsLoading ? (
            <ActivityIndicator size="small" color={colors.primary.main} />
          ) : challengePosts.length > 0 ? (
            <FlatList
              data={challengePosts}
              renderItem={renderPostItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.postsList}
              style={styles.postsContainer}
            />
          ) : (
            <View style={styles.noPostsContainer}>
              <Text style={styles.noPostsText}>No posts yet</Text>
              {userJoined && isActive && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={navigateToCreatePost}
                >
                  <Text style={styles.actionButtonText}>Be the first to post!</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.lightest,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    ...textStyles.h2,
    color: colors.neutral.dark,
    marginBottom: 16,
  },
  backButtonText: {
    ...textStyles.button,
    color: colors.primary.main,
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.neutral.dark,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  challengeTitle: {
    ...textStyles.h1,
    color: colors.neutral.dark,
    flex: 1,
  },
  featuredBadge: {
    backgroundColor: colors.accent.main,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  featuredText: {
    ...textStyles.caption,
    color: colors.white,
    fontWeight: '600',
  },
  challengeDescription: {
    ...textStyles.body1,
    color: colors.neutral.dark,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    ...textStyles.body2,
    color: colors.neutral.dark,
    marginLeft: 4,
  },
  dateContainer: {
    padding: 16,
    paddingTop: 0,
    marginBottom: 16,
  },
  dateLabel: {
    ...textStyles.caption,
    color: colors.neutral.dark,
    marginBottom: 2,
  },
  dateValue: {
    ...textStyles.body1,
    color: colors.neutral.dark,
    marginBottom: 8,
  },
  progressContainer: {
    padding: 16,
    paddingTop: 0,
    marginBottom: 16,
  },
  progressBackground: {
    height: 8,
    backgroundColor: colors.neutral.light,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: 4,
  },
  progressText: {
    ...textStyles.caption,
    color: colors.neutral.dark,
  },
  rewardsContainer: {
    padding: 16,
    paddingTop: 0,
    marginBottom: 16,
    backgroundColor: colors.primary.lightest,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  rewardsTitle: {
    ...textStyles.subtitle,
    color: colors.primary.dark,
    marginBottom: 4,
  },
  rewardsText: {
    ...textStyles.body1,
    color: colors.neutral.dark,
  },
  participationContainer: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: colors.neutral.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  participationText: {
    ...textStyles.body1,
    color: colors.primary.dark,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  actionButtonText: {
    ...textStyles.button,
    color: colors.white,
  },
  leaveButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  leaveButtonText: {
    ...textStyles.button,
    color: colors.feedback.error,
  },
  joinContainer: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    minWidth: width * 0.6,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    backgroundColor: colors.neutral.light,
  },
  joinButtonText: {
    ...textStyles.button,
    color: colors.white,
    fontSize: 16,
  },
  postsSection: {
    padding: 16,
    paddingBottom: 0,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.neutral.dark,
    marginBottom: 16,
  },
  postsContainer: {
    marginLeft: -16,
    marginRight: -16,
  },
  postsList: {
    paddingHorizontal: 16,
  },
  postCard: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: colors.neutral.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  postInfo: {
    padding: 12,
  },
  postUser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  userName: {
    ...textStyles.body2,
    color: colors.neutral.dark,
    fontWeight: '600',
  },
  postCaption: {
    ...textStyles.caption,
    color: colors.neutral.dark,
  },
  noPostsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noPostsText: {
    ...textStyles.body1,
    color: colors.neutral.dark,
    marginBottom: 16,
  },
});

export default ChallengeDetailScreen; 