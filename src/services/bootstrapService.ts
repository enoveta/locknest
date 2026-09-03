import {ensureLocalUser} from './userService';
import {seedDefaultLockedApps, listProtectedApps} from './appLockService';
import {isStayModeActive} from './stayModeService';
import {isGuestModeActive} from './guestModeService';
import {listNotifications, listSecurityEvents} from './securityService';
import {loadSettings} from './settingsService';
import {hasPasscode, isOnboardingComplete} from './authService';
import type {AppNotification, AppSettings} from '../types';
import type {ProtectedApp} from '../database/repositories/protectedAppRepository';
import type {SecurityEvent} from '../database/repositories/securityRepository';
import type {User} from '../database/repositories/userRepository';

export type BootstrapState = {
  user: User;
  settings: AppSettings;
  lockedApps: ProtectedApp[];
  stayModeActive: boolean;
  guestModeActive: boolean;
  notifications: AppNotification[];
  events: SecurityEvent[];
  hasPasscode: boolean;
  onboardingComplete: boolean;
};

export async function bootstrapApp(): Promise<BootstrapState> {
  const user = await ensureLocalUser();
  await seedDefaultLockedApps(user.id);

  const [settings, lockedApps, stayModeActive, guestModeActive, notifications, events, passcodeSet, onboardingComplete] =
    await Promise.all([
      loadSettings(user.id),
      listProtectedApps(user.id),
      isStayModeActive(user.id),
      isGuestModeActive(user.id),
      listNotifications(user.id),
      listSecurityEvents(user.id),
      hasPasscode(),
      isOnboardingComplete(),
    ]);

  return {
    user,
    settings,
    lockedApps,
    stayModeActive,
    guestModeActive,
    notifications,
    events,
    hasPasscode: passcodeSet,
    onboardingComplete,
  };
}
