import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

import { initializeDatabase } from './src/database';
import { AppNavigator } from './src/navigation/AppNavigator';

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

  if (!databaseReady && !databaseError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {databaseError ? null : <AppNavigator />}
    </SafeAreaProvider>
  );
}

export default App;