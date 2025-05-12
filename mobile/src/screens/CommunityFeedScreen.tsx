import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getPosts, getChallenges, likePost, unlikePost } from '../services/communityService';
import { Post, Challenge } from '../types/Community';
import { colors, textStyles } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CommunityFeedScreen: React.FC = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterByFollowing, setFilterByFollowing] = useState(false);

  const fetchPosts = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        const { posts: newPosts, lastVisible: newLastVisible } = await getPosts(
          undefined,
          10,
          filterByFollowing
        );
        setPosts(newPosts);
        setLastVisible(newLastVisible);
        setRefreshing(false);
      } else {
        setLoading(true);
        const { posts: newPosts, lastVisible: newLastVisible } = await getPosts(
          undefined,
          10,
          filterByFollowing
        );
        setPosts(newPosts);
        setLastVisible(newLastVisible);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterByFollowing]);

  const fetchChallenges = useCallback(async () => {
    try {
      const { challenges: featuredChallenges } = await getChallenges(
        'active',
        true,
        undefined,
        3
      );
      setChallenges(featuredChallenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchChallenges();
  }, [fetchPosts, fetchChallenges]);

  const handleRefresh = useCallback(() => {
    fetchPosts(true);
    fetchChallenges();
  }, [fetchPosts, fetchChallenges]);

  const handleLoadMore = useCallback(async () => {
    if (!lastVisible || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const { posts: morePosts, lastVisible: newLastVisible } = await getPosts(
        lastVisible,
        10,
        filterByFollowing
      );
      
      if (morePosts.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...morePosts]);
        setLastVisible(newLastVisible);
      }
      
      setLoadingMore(false);
    } catch (error) {
      console.error('Error loading more posts:', error);
      setLoadingMore(false);
    }
  }, [lastVisible, loadingMore, filterByFollowing]);

  const handleLikeToggle = useCallback(async (post: Post, index: number) => {
    try {
      const currentPosts = [...posts];
      const currentPost = currentPosts[index];
      
      if (currentPost.likes.includes(currentPost.userId)) {
        // Unlike post
        currentPost.likes = currentPost.likes.filter(id => id !== currentPost.userId);
        setPosts(currentPosts);
        await unlikePost(post.id);
      } else {
        // Like post
        currentPost.likes.push(currentPost.userId);
        setPosts(currentPosts);
        await likePost(post.id);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      fetchPosts(true);
    }
  }, [posts]);

  const navigateToPostDetail = (post: Post) => {
    navigation.navigate('PostDetail', { postId: post.id });
  };

  const navigateToChallengeDetail = (challenge: Challenge) => {
    navigation.navigate('ChallengeDetail', { challengeId: challenge.id });
  };

  const renderChallengeItem = ({ item }: { item: Challenge }) => (
    <TouchableOpacity
      style={styles.challengeCard}
      onPress={() => navigateToChallengeDetail(item)}
    >
      <Image source={{ uri: item.coverImageURL }} style={styles.challengeImage} />
      <View style={styles.challengeInfo}>
        <Text style={styles.challengeTitle}>{item.title}</Text>
        <Text style={styles.challengeMeta}>
          {item.participants.length} participants • {item.postCount} posts
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderPostItem = ({ item, index }: { item: Post; index: number }) => (
    <View style={styles.postCard}>
      <TouchableOpacity 
        style={styles.postHeader}
        onPress={() => navigation.navigate('Profile', { userId: item.userId })}
      >
        <Image 
          source={{ uri: item.userPhotoURL || 'https://via.placeholder.com/40' }} 
          style={styles.avatar} 
        />
        <View>
          <Text style={styles.userName}>{item.userName}</Text>
          {item.challengeId && (
            <Text style={styles.challengeTag}>In Challenge</Text>
          )}
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigateToPostDetail(item)}>
        <Image source={{ uri: item.photoURL }} style={styles.postImage} />
      </TouchableOpacity>
      
      <View style={styles.postActions}>
        <TouchableOpacity onPress={() => handleLikeToggle(item, index)}>
          <Ionicons 
            name={item.likes.includes(item.userId) ? "heart" : "heart-outline"} 
            size={24} 
            color={item.likes.includes(item.userId) ? colors.accent.main : colors.neutral.dark} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.commentButton}
          onPress={() => navigateToPostDetail(item)}
        >
          <Ionicons name="chatbubble-outline" size={22} color={colors.neutral.dark} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.postContent}>
        <Text style={styles.recipeName}>
          {item.recipeName}
          {item.difficulty && (
            <Text style={styles.difficulty}> • {item.difficulty}</Text>
          )}
        </Text>
        
        <Text style={styles.caption}>{item.caption}</Text>
        
        {item.dietaryTags && item.dietaryTags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.dietaryTags.map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.postMeta}>
          <Text style={styles.likes}>{item.likes.length} likes</Text>
          <TouchableOpacity onPress={() => navigateToPostDetail(item)}>
            <Text style={styles.comments}>
              View all {item.commentCount} comments
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderListHeader = () => (
    <>
      <View style={styles.feedHeader}>
        <Text style={styles.headerTitle}>Community Feed</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              !filterByFollowing && styles.filterButtonActive
            ]}
            onPress={() => setFilterByFollowing(false)}
          >
            <Text
              style={[
                styles.filterButtonText,
                !filterByFollowing && styles.filterButtonTextActive
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterByFollowing && styles.filterButtonActive
            ]}
            onPress={() => setFilterByFollowing(true)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterByFollowing && styles.filterButtonTextActive
              ]}
            >
              Following
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {challenges.length > 0 && (
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Challenges')}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={challenges}
            renderItem={renderChallengeItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.challengeList}
          />
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Posts</Text>
      </View>
    </>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedContainer}
        ListHeaderComponent={renderListHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary.main]}
            tintColor={colors.primary.main}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadMoreIndicator}>
              <ActivityIndicator size="small" color={colors.primary.main} />
            </View>
          ) : null
        }
      />
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
  feedContainer: {
    paddingBottom: 20,
  },
  feedHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...textStyles.h1,
    color: colors.neutral.darkest,
  },
  filterButtons: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.lighter,
    borderRadius: 20,
    padding: 2,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  filterButtonActive: {
    backgroundColor: colors.primary.main,
  },
  filterButtonText: {
    ...textStyles.body2,
    color: colors.neutral.dark,
  },
  filterButtonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    ...textStyles.h2,
    color: colors.neutral.darkest,
  },
  seeAll: {
    ...textStyles.body2,
    color: colors.primary.main,
    fontWeight: '600',
  },
  challengeList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  challengeCard: {
    width: width * 0.75,
    height: 120,
    marginRight: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  challengeImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  challengeInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  challengeTitle: {
    ...textStyles.h3,
    color: colors.white,
    marginBottom: 2,
  },
  challengeMeta: {
    ...textStyles.caption,
    color: colors.white,
    opacity: 0.8,
  },
  postCard: {
    backgroundColor: colors.white,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    ...textStyles.subtitle1,
    color: colors.neutral.darkest,
  },
  challengeTag: {
    ...textStyles.caption,
    color: colors.primary.main,
    fontWeight: '600',
  },
  postImage: {
    width: '100%',
    height: width,
    resizeMode: 'cover',
  },
  postActions: {
    flexDirection: 'row',
    padding: 12,
  },
  commentButton: {
    marginLeft: 16,
  },
  postContent: {
    padding: 12,
    paddingTop: 0,
  },
  recipeName: {
    ...textStyles.subtitle1,
    color: colors.neutral.darkest,
    marginBottom: 4,
  },
  difficulty: {
    ...textStyles.body2,
    color: colors.neutral.dark,
  },
  caption: {
    ...textStyles.body1,
    color: colors.neutral.dark,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: colors.primary.lightest,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    ...textStyles.caption,
    color: colors.primary.dark,
  },
  postMeta: {
    marginTop: 8,
  },
  likes: {
    ...textStyles.body2,
    fontWeight: '600',
    marginBottom: 2,
  },
  comments: {
    ...textStyles.body2,
    color: colors.neutral.dark,
  },
  loadMoreIndicator: {
    padding: 20,
    alignItems: 'center',
  },
});

export default CommunityFeedScreen; 