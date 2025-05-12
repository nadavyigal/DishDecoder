import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { 
  getPostById, 
  getComments, 
  addComment, 
  likePost, 
  unlikePost 
} from '../services/communityService';
import { Post, Comment } from '../types/Community';
import { colors, textStyles } from '../theme';

type RouteParams = {
  PostDetail: {
    postId: string;
  };
};

const PostDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'PostDetail'>>();
  const { postId } = route.params;
  const { width } = Dimensions.get('window');
  const commentInputRef = useRef<TextInput>(null);

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      const fetchedPost = await getPostById(postId);
      setPost(fetchedPost);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  }, [postId]);

  const fetchComments = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        const { comments: newComments, lastVisible: newLastVisible } = await getComments(postId);
        setComments(newComments);
        setLastVisible(newLastVisible);
        setRefreshing(false);
      } else {
        setLoading(true);
        const { comments: newComments, lastVisible: newLastVisible } = await getComments(postId);
        setComments(newComments);
        setLastVisible(newLastVisible);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
      setRefreshing(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  const handleRefresh = useCallback(() => {
    fetchPost();
    fetchComments(true);
  }, [fetchPost, fetchComments]);

  const handleLoadMoreComments = useCallback(async () => {
    if (!lastVisible || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const { comments: moreComments, lastVisible: newLastVisible } = await getComments(
        postId,
        lastVisible
      );
      
      if (moreComments.length > 0) {
        setComments(prevComments => [...prevComments, ...moreComments]);
        setLastVisible(newLastVisible);
      }
      
      setLoadingMore(false);
    } catch (error) {
      console.error('Error loading more comments:', error);
      setLoadingMore(false);
    }
  }, [lastVisible, loadingMore, postId]);

  const handleAddComment = useCallback(async () => {
    if (!commentText.trim() || commentLoading) return;

    try {
      setCommentLoading(true);
      await addComment(postId, commentText.trim());
      
      // Update post and comments
      fetchPost();
      fetchComments(true);
      
      // Clear input
      setCommentText('');
      setCommentLoading(false);
    } catch (error) {
      console.error('Error adding comment:', error);
      setCommentLoading(false);
    }
  }, [commentText, commentLoading, postId, fetchPost, fetchComments]);

  const handleLikeToggle = useCallback(async () => {
    if (!post) return;
    
    try {
      // Optimistic update
      const isLiked = post.likes.includes(post.userId);
      const updatedPost = { ...post };
      
      if (isLiked) {
        // Unlike post
        updatedPost.likes = post.likes.filter(id => id !== post.userId);
        setPost(updatedPost);
        await unlikePost(post.id);
      } else {
        // Like post
        updatedPost.likes = [...post.likes, post.userId];
        setPost(updatedPost);
        await likePost(post.id);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      fetchPost();
    }
  }, [post, fetchPost]);

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image
        source={{ uri: item.userPhotoURL || 'https://via.placeholder.com/40' }}
        style={styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentUserName}>{item.userName}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
        <Text style={styles.commentTimestamp}>
          {item.createdAt.toDate().toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  if (loading || !post) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.neutral.darkest} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={styles.headerRight} />
        </View>

        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary.main]}
              tintColor={colors.primary.main}
            />
          }
          onEndReached={handleLoadMoreComments}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={
            <View style={styles.postContainer}>
              <View style={styles.postHeader}>
                <TouchableOpacity 
                  style={styles.userInfo}
                  onPress={() => navigation.navigate('Profile', { userId: post.userId })}
                >
                  <Image
                    source={{ uri: post.userPhotoURL || 'https://via.placeholder.com/40' }}
                    style={styles.avatar}
                  />
                  <View>
                    <Text style={styles.userName}>{post.userName}</Text>
                    {post.challengeId && (
                      <Text style={styles.challengeTag}>In Challenge</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              <Image source={{ uri: post.photoURL }} style={[styles.postImage, { height: width }]} />

              <View style={styles.postActions}>
                <TouchableOpacity onPress={handleLikeToggle}>
                  <Ionicons
                    name={post.likes.includes(post.userId) ? "heart" : "heart-outline"}
                    size={24}
                    color={post.likes.includes(post.userId) ? colors.accent.main : colors.neutral.dark}
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.commentButton}
                  onPress={() => commentInputRef.current?.focus()}
                >
                  <Ionicons name="chatbubble-outline" size={22} color={colors.neutral.dark} />
                </TouchableOpacity>
              </View>

              <View style={styles.postContent}>
                <Text style={styles.recipeName}>
                  {post.recipeName}
                  {post.difficulty && (
                    <Text style={styles.difficulty}> • {post.difficulty}</Text>
                  )}
                </Text>

                <Text style={styles.caption}>{post.caption}</Text>

                {post.dietaryTags && post.dietaryTags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {post.dietaryTags.map((tag, idx) => (
                      <View key={idx} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={styles.likes}>{post.likes.length} likes</Text>
                <Text style={styles.timestamp}>
                  {post.createdAt.toDate().toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.commentsHeader}>
                <Text style={styles.commentsTitle}>Comments ({post.commentCount})</Text>
              </View>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loadMoreIndicator}>
                <ActivityIndicator size="small" color={colors.primary.main} />
              </View>
            ) : comments.length === 0 ? (
              <View style={styles.noCommentsContainer}>
                <Text style={styles.noCommentsText}>No comments yet</Text>
                <Text style={styles.noCommentsSubtext}>Be the first to comment!</Text>
              </View>
            ) : null
          }
        />

        <View style={styles.commentInputContainer}>
          <TextInput
            ref={commentInputRef}
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
          {commentLoading ? (
            <ActivityIndicator size="small" color={colors.primary.main} />
          ) : (
            <TouchableOpacity
              style={[styles.commentButton, !commentText.trim() && styles.commentButtonDisabled]}
              onPress={handleAddComment}
              disabled={!commentText.trim()}
            >
              <Ionicons
                name="send"
                size={22}
                color={!commentText.trim() ? colors.neutral.light : colors.primary.main}
              />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lighter,
    backgroundColor: colors.white,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.neutral.darkest,
  },
  headerRight: {
    width: 32,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  postContainer: {
    backgroundColor: colors.white,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lighter,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
  likes: {
    ...textStyles.body2,
    fontWeight: '600',
    marginBottom: 2,
  },
  timestamp: {
    ...textStyles.caption,
    color: colors.neutral.dark,
    marginTop: 4,
  },
  commentsHeader: {
    padding: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.lighter,
  },
  commentsTitle: {
    ...textStyles.h3,
    color: colors.neutral.darkest,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentUserName: {
    ...textStyles.body2,
    fontWeight: '600',
    marginBottom: 2,
  },
  commentText: {
    ...textStyles.body1,
    color: colors.neutral.dark,
    marginBottom: 4,
  },
  commentTimestamp: {
    ...textStyles.caption,
    color: colors.neutral.dark,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.lighter,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.neutral.lightest,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 40,
    maxHeight: 100,
    ...textStyles.body1,
  },
  commentButtonDisabled: {
    opacity: 0.5,
  },
  loadMoreIndicator: {
    padding: 20,
    alignItems: 'center',
  },
  noCommentsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noCommentsText: {
    ...textStyles.body1,
    color: colors.neutral.dark,
    marginBottom: 4,
  },
  noCommentsSubtext: {
    ...textStyles.caption,
    color: colors.neutral.dark,
  },
});

export default PostDetailScreen; 