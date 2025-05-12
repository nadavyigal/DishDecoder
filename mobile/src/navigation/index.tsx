import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { colors, textStyles } from '../theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import RecipeScreen from '../screens/RecipeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CommunityFeedScreen from '../screens/CommunityFeedScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import ChallengeDetailScreen from '../screens/ChallengeDetailScreen';
import VideoTutorialsScreen from '../screens/VideoTutorialsScreen';

// Tab Icons
const TabIcon = ({ focused, iconType }: { focused: boolean; iconType: string }) => {
  let content = '';
  
  switch (iconType) {
    case 'home':
      content = '🏠';
      break;
    case 'camera':
      content = '📷';
      break;
    case 'community':
      content = '👥';
      break;
    case 'favorites':
      content = '❤️';
      break;
    case 'profile':
      content = '👤';
      break;
    default:
      content = '●';
  }

  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
        {content}
      </Text>
    </View>
  );
};

// Create navigation stacks/tabs
const HomeStack = createStackNavigator();
const CameraStack = createStackNavigator();
const CommunityStack = createStackNavigator();
const FavoritesStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
    <HomeStack.Screen name="Recipe" component={RecipeScreen} />
    <HomeStack.Screen name="VideoTutorials" component={VideoTutorialsScreen} />
  </HomeStack.Navigator>
);

// Camera Stack
const CameraStackNavigator = () => (
  <CameraStack.Navigator screenOptions={{ headerShown: false }}>
    <CameraStack.Screen name="CameraScreen" component={CameraScreen} />
    <CameraStack.Screen name="Recipe" component={RecipeScreen} />
    <CameraStack.Screen name="VideoTutorials" component={VideoTutorialsScreen} />
  </CameraStack.Navigator>
);

// Community Stack
const CommunityStackNavigator = () => (
  <CommunityStack.Navigator screenOptions={{ headerShown: false }}>
    <CommunityStack.Screen name="CommunityFeed" component={CommunityFeedScreen} />
    <CommunityStack.Screen name="PostDetail" component={PostDetailScreen} />
    <CommunityStack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
    <CommunityStack.Screen name="Challenges" component={ChallengesScreen} />
    <CommunityStack.Screen name="Recipe" component={RecipeScreen} />
    <CommunityStack.Screen name="Profile" component={ProfileScreen} />
    <CommunityStack.Screen name="VideoTutorials" component={VideoTutorialsScreen} />
  </CommunityStack.Navigator>
);

// Favorites Stack
const FavoritesStackNavigator = () => (
  <FavoritesStack.Navigator screenOptions={{ headerShown: false }}>
    <FavoritesStack.Screen name="FavoritesScreen" component={FavoritesScreen} />
    <FavoritesStack.Screen name="Recipe" component={RecipeScreen} />
    <FavoritesStack.Screen name="VideoTutorials" component={VideoTutorialsScreen} />
  </FavoritesStack.Navigator>
);

// Profile Stack
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
    <ProfileStack.Screen name="Recipe" component={RecipeScreen} />
    <ProfileStack.Screen name="PostDetail" component={PostDetailScreen} />
    <ProfileStack.Screen name="Challenges" component={ChallengesScreen} />
    <ProfileStack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
    <ProfileStack.Screen name="VideoTutorials" component={VideoTutorialsScreen} />
  </ProfileStack.Navigator>
);

// Main Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: colors.primary.main,
      tabBarInactiveTintColor: colors.neutral.dark,
      headerShown: false,
      tabBarHideOnKeyboard: true,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeStackNavigator}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconType="home" />,
      }}
    />
    <Tab.Screen
      name="Camera"
      component={CameraStackNavigator}
      options={{
        tabBarLabel: 'Discover',
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconType="camera" />,
      }}
    />
    <Tab.Screen
      name="Community"
      component={CommunityStackNavigator}
      options={{
        tabBarLabel: 'Community',
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconType="community" />,
      }}
    />
    <Tab.Screen
      name="Favorites"
      component={FavoritesStackNavigator}
      options={{
        tabBarLabel: 'Favorites',
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconType="favorites" />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStackNavigator}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} iconType="profile" />,
      }}
    />
  </Tab.Navigator>
);

// Root Navigator
const RootNavigator = () => (
  <NavigationContainer>
    <TabNavigator />
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.light,
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 10,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 3,
    opacity: 0.7,
  },
  tabIconFocused: {
    opacity: 1,
  },
});

export default RootNavigator; 