import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getChallenges, getUserChallenges } from '../services/communityService';
import { Challenge } from '../types/Community';
import { colors, textStyles } from '../theme';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;

type ChallengeFilter = 'all' | 'joined' | 'featured';
type ChallengeStatus = 'active' | 'upcoming' | 'completed';

const ChallengesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [filter, setFilter] = useState<ChallengeFilter>('all');
  const [status, setStatus] = useState<ChallengeStatus>('active');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchChallenges = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      let result;
      if (filter === 'joined') {
        result = await getUserChallenges(undefined, status);
      } else {
        const featured = filter === 'featured';
        result = await getChallenges(status, featured);
      }

      setChallenges(result.challenges);
      setLastVisible(result.lastVisible);

      if (refresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter, status]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const handleRefresh = useCallback(() => {
    fetchChallenges(true);
  }, [fetchChallenges]);

  const handleLoadMore = useCallback(async () => {
    if (!lastVisible || loadingMore) return;
    
    try {
      setLoadingMore(true);
      let result;
      
      if (filter === 'joined') {
        result = await getUserChallenges(undefined, status, lastVisible);
      } else {
        const featured = filter === 'featured';
        result = await getChallenges(status, featured, lastVisible);
      }
      
      if (result.challenges.length > 0) {
        setChallenges(prevChallenges => [...prevChallenges, ...result.challenges]);
        setLastVisible(result.lastVisible);
      }
      
      setLoadingMore(false);
    } catch (error) {
      console.error('Error loading more challenges:', error);
      setLoadingMore(false);
    }
  }, [lastVisible, loadingMore, filter, status]);

  const navigateToChallengeDetail = (challenge: Challenge) => {
    navigation.navigate('ChallengeDetail', { challengeId: challenge.id });
  };

  const renderChallengeCard = ({ item }: { item: Challenge }) => {
    const startDate = item.startDate.toDate();
    const endDate = item.endDate.toDate();
    const now = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return (
      <TouchableOpacity
        style={styles.challengeCard}
        onPress={() => navigateToChallengeDetail(item)}
      >
        <Image source={{ uri: item.coverImageURL }} style={styles.challengeImage} />
        
        <View style={styles.challengeContentContainer}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>{item.title}</Text>
            {item.featured && (
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredText}>Featured</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.challengeDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.challengeStats}>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={16} color={colors.neutral.dark} />
              <Text style={styles.statText}>{item.participants.length} participants</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="image-outline" size={16} color={colors.neutral.dark} />
              <Text style={styles.statText}>{item.postCount} posts</Text>
            </View>
          </View>
          
          <View style={styles.challengeDates}>
            <Text style={styles.dateLabel}>
              {status === 'active' 
                ? `${daysLeft} days left` 
                : status === 'upcoming' 
                  ? `Starts ${startDate.toLocaleDateString()}` 
                  : `Ended ${endDate.toLocaleDateString()}`}
            </Text>
          </View>
          
          <View style={styles.challengeFooter}>
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${Math.min(
                      100, 
                      status === 'completed' 
                        ? 100 
                        : Math.round(
                            ((now.getTime() - startDate.getTime()) / 
                            (endDate.getTime() - startDate.getTime())) * 100
                          )
                    )}%` 
                  }
                ]} 
              />
            </View>
            
            <TouchableOpacity 
              style={[
                styles.actionButton,
                item.participants.includes('currentUserId') && styles.actionButtonJoined
              ]}
              onPress={() => navigateToChallengeDetail(item)}
            >
              <Text style={[
                styles.actionButtonText,
                item.participants.includes('currentUserId') && styles.actionButtonTextJoined
              ]}>
                {item.participants.includes('currentUserId') 
                  ? status === 'active' 
                    ? 'View & Share' 
                    : 'View Details'
                  : status === 'active' 
                    ? 'Join Challenge' 
                    : 'View Details'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterOptions = () => (
    <View style={styles.filterContainer}>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filter === 'joined' && styles.filterTabActive]}
          onPress={() => setFilter('joined')}
        >
          <Text style={[styles.filterText, filter === 'joined' && styles.filterTextActive]}>
            Joined
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filter === 'featured' && styles.filterTabActive]}
          onPress={() => setFilter('featured')}
        >
          <Text style={[styles.filterText, filter === 'featured' && styles.filterTextActive]}>
            Featured
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.statusTab, status === 'active' && styles.statusTabActive]}
          onPress={() => setStatus('active')}
        >
          <Text style={[styles.statusText, status === 'active' && styles.statusTextActive]}>
            Active
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.statusTab, status === 'upcoming' && styles.statusTabActive]}
          onPress={() => setStatus('upcoming')}
        >
          <Text style={[styles.statusText, status === 'upcoming' && styles.statusTextActive]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.statusTab, status === 'completed' && styles.statusTabActive]}
          onPress={() => setStatus('completed')}
        >
          <Text style={[styles.statusText, status === 'completed' && styles.statusTextActive]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.neutral.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cooking Challenges</Text>
        <View style={styles.headerRight} />
      </View>
      
      <FlatList
        data={challenges}
        renderItem={renderChallengeCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderFilterOptions}
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={64} color={colors.neutral.light} />
            <Text style={styles.emptyTitle}>No challenges found</Text>
            <Text style={styles.emptyMessage}>
              {filter === 'joined' 
                ? "You haven't joined any challenges yet"
                : "There are no challenges available right now"}
            </Text>
          </View>
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
  headerRight: {
    width: 32,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.neutral.lightest,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral.light,
  },
  filterTabActive: {
    backgroundColor: colors.primary.light,
    borderColor: colors.primary.main,
  },
  filterText: {
    ...textStyles.body2,
    color: colors.neutral.dark,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.primary.dark,
    fontWeight: '600',
  },
  statusTab: {
    flex: 1,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: colors.neutral.lightest,
    alignItems: 'center',
  },
  statusTabActive: {
    backgroundColor: colors.primary.main,
  },
  statusText: {
    ...textStyles.caption,
    color: colors.neutral.dark,
  },
  statusTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  challengeCard: {
    width: cardWidth,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: colors.neutral.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  challengeImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  challengeContentContainer: {
    padding: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  challengeTitle: {
    ...textStyles.h3,
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
    ...textStyles.body2,
    color: colors.neutral.dark,
    marginBottom: 12,
  },
  challengeStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    ...textStyles.caption,
    color: colors.neutral.dark,
    marginLeft: 4,
  },
  challengeDates: {
    marginBottom: 12,
  },
  dateLabel: {
    ...textStyles.body2,
    color: colors.primary.dark,
    fontWeight: '600',
  },
  challengeFooter: {
    marginTop: 8,
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.neutral.light,
    borderRadius: 2,
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: 2,
  },
  actionButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary.main,
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionButtonJoined: {
    backgroundColor: colors.primary.main,
  },
  actionButtonText: {
    ...textStyles.button,
    color: colors.primary.main,
  },
  actionButtonTextJoined: {
    color: colors.white,
  },
  loadMoreIndicator: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyTitle: {
    ...textStyles.h3,
    color: colors.neutral.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    ...textStyles.body1,
    color: colors.neutral.dark,
    textAlign: 'center',
  },
});

export default ChallengesScreen; 