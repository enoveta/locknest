export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Passcode: {mode: 'create' | 'unlock' | 'change'};
  Dashboard: undefined;
  AppLock: undefined;
  AppLocked: {appName: string; emoji: string; packageName: string};
  StayMode: undefined;
  GuestMode: undefined;
  VoiceAssistant: undefined;
  Intruder: undefined;
  SecurityEvents: undefined;
  Settings: undefined;
  Profile: undefined;
  Notifications: undefined;
};

export type BottomTabKey = 'home' | 'apps' | 'modes' | 'security' | 'settings';
