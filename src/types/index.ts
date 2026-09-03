export type NotificationType =
  | 'intruder'
  | 'passcode'
  | 'unlock'
  | 'mode'
  | 'system';

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  eventId?: number;
};

export type AppSettings = {
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  voiceEnabled: boolean;
  theme: 'dark' | 'light';
  displayName: string;
};

export type VoicePhase =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'success'
  | 'error';

export type VoiceCommandResult = {
  ok: boolean;
  message: string;
  navigateTo?:
    | 'StayMode'
    | 'GuestMode'
    | 'SecurityEvents'
    | 'Settings'
    | 'AppLock'
    | 'Dashboard';
};
