import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, StyleSheet } from 'react-native';
import { colors } from './theme';

// Import navigation
import RootNavigator from './navigation';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar
        style="dark"
        backgroundColor={colors.white}
        translucent={Platform.OS === 'android'}
      />
      <View style={styles.container}>
        <RootNavigator />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.lightest,
  },
});

export default App; 