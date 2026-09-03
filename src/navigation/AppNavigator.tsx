import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { PasscodeScreen } from '../screens/auth/PasscodeScreen';
import { DashboardScreen } from '../screens/home/DashboardScreen';
import { AppLockScreen } from '../screens/appLock/AppLockScreen';
import { StayModeScreen } from '../screens/stayMode/StayModeScreen';
import { GuestModeScreen } from '../screens/guestMode/GuestModeScreen';
import { SecurityEventsScreen } from '../screens/security/SecurityEventsScreen';
import { IntruderDetectedScreen } from '../screens/security/IntruderDetectedScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { VoiceAssistantScreen } from '../screens/voice/VoiceAssistantScreen';
import { AppLockedScreen } from '../screens/appLock/AppLockedScreen';
import { hasPasscode, isOnboardingComplete } from '../services/authService';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [hasPasscodeValue, setHasPasscodeValue] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([isOnboardingComplete(), hasPasscode()])
      .then(([onboardingComplete, passcodeExists]) => {
        if (!active) {
          return;
        }

        setHasSeenOnboarding(onboardingComplete);
        setHasPasscodeValue(passcodeExists);
        setIsBooting(false);
      })
      .catch(error => {
        console.warn('Failed to resolve app boot state:', error);
        if (active) {
          setIsBooting(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const initialRouteName = useMemo(() => {
    if (isBooting) {
      return 'Splash';
    }

    if (!hasSeenOnboarding) {
      return 'Onboarding';
    }

    if (!hasPasscodeValue) {
      return 'Passcode';
    }

    return 'Dashboard';
  }, [hasPasscodeValue, hasSeenOnboarding, isBooting]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {backgroundColor: '#07111d'},
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding">
          {props => (
            <OnboardingScreen
              {...props}
              onComplete={() => {
                setHasSeenOnboarding(true);
                setHasPasscodeValue(false);
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Passcode">
          {props => (
            <PasscodeScreen
              {...props}
              mode="create"
              onComplete={() => {
                setHasPasscodeValue(true);
                setIsBooting(false);
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="AppLock" component={AppLockScreen} />
        <Stack.Screen name="AppLocked" component={AppLockedScreen} />
        <Stack.Screen name="StayMode" component={StayModeScreen} />
        <Stack.Screen name="GuestMode" component={GuestModeScreen} />
        <Stack.Screen name="VoiceAssistant" component={VoiceAssistantScreen} />
        <Stack.Screen name="Intruder" component={IntruderDetectedScreen} />
        <Stack.Screen name="SecurityEvents" component={SecurityEventsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
