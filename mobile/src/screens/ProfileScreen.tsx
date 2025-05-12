import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, spacing, textStyles } from '../theme';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ProfileScreen: React.FC = () => {
  const userProfile = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    bio: 'Enthusiastic home cook who loves trying new recipes.',
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    preferences: {
      dietary: ['Vegetarian'],
      cuisines: ['Italian', 'Thai', 'Mexican'],
      allergies: ['Nuts'],
    },
  };
  
  const stats = [
    { label: 'Recipes Tried', value: '27' },
    { label: 'Favorites', value: '12' },
    { label: 'Contributions', value: '5' },
  ];
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: userProfile.profileImage }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileEmail}>{userProfile.email}</Text>
        </View>

        <View style={styles.profileBio}>
          <Text style={styles.bioText}>{userProfile.bio}</Text>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          <Card style={styles.sectionCard}>
            <View style={styles.preferenceTagsContainer}>
              {userProfile.preferences.dietary.map((pref, index) => (
                <View key={index} style={styles.preferenceTag}>
                  <Text style={styles.preferenceTagText}>{pref}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Cuisines</Text>
          <Card style={styles.sectionCard}>
            <View style={styles.preferenceTagsContainer}>
              {userProfile.preferences.cuisines.map((cuisine, index) => (
                <View key={index} style={styles.preferenceTag}>
                  <Text style={styles.preferenceTagText}>{cuisine}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergies</Text>
          <Card style={styles.sectionCard}>
            <View style={styles.preferenceTagsContainer}>
              {userProfile.preferences.allergies.map((allergy, index) => (
                <View key={index} style={[styles.preferenceTag, styles.allergyTag]}>
                  <Text style={styles.preferenceTagText}>{allergy}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Edit Profile"
            variant="outline"
            style={styles.editButton}
          />
          <Button
            title="Logout"
            variant="primary"
            style={styles.logoutButton}
            onPress={handleLogout}
          />
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
  scrollContent: {
    padding: spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: colors.primary.main,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    ...textStyles.h2,
    color: colors.primary.dark,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    ...textStyles.body,
    color: colors.neutral.dark,
  },
  profileBio: {
    marginBottom: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
  },
  bioText: {
    ...textStyles.body,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...textStyles.h2,
    color: colors.primary.main,
  },
  statLabel: {
    ...textStyles.caption,
    color: colors.neutral.dark,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.subtitle,
    marginBottom: spacing.sm,
    color: colors.primary.dark,
  },
  sectionCard: {
    padding: spacing.md,
  },
  preferenceTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  preferenceTag: {
    backgroundColor: colors.secondary.light,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  allergyTag: {
    backgroundColor: colors.feedback.error,
  },
  preferenceTagText: {
    ...textStyles.caption,
    color: colors.white,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  editButton: {
    marginBottom: spacing.md,
  },
  logoutButton: {
    backgroundColor: colors.feedback.error,
  },
});

export default ProfileScreen; 