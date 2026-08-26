import { NewAppScreen } from '@react-native/new-app-screen';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

import { initializeDatabase } from './src/database';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [databaseReady, setDatabaseReady] = useState(false);
  const [databaseError, setDatabaseError] = useState<string | null>(null);

  useEffect(() => {
    initializeDatabase()
      .then(() => {
        setDatabaseReady(true);
      })
      .catch(error => {
        console.error('LockNest database initialization failed:', error);
        setDatabaseError(
          error instanceof Error
            ? error.message
            : 'Unknown database error',
        );
      });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      {!databaseReady && !databaseError ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            Initializing LockNest...
          </Text>
        </View>
      ) : databaseError ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>
            Database initialization failed.
          </Text>

          <Text style={styles.errorDetails}>
            {databaseError}
          </Text>
        </View>
      ) : (
        <AppContent />
      )}
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  loadingText: {
    fontSize: 18,
  },

  errorText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },

  errorDetails: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default App;