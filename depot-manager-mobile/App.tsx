import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { initializeLocalDatabase } from './src/database/sqlite';
import { startHybridSyncListener } from './src/services/syncEngine';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    let cleanupSync: (() => void) | undefined;

    async function bootstrap() {
      await initializeLocalDatabase();
      cleanupSync = startHybridSyncListener();
      setDbReady(true);
    }

    bootstrap();
    return () => {
      if (cleanupSync) cleanupSync();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <RootNavigator dbReady={dbReady} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
