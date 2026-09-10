import {
  getUserSettings,
  updateUserSettings,
} from '../database/repositories/userSettingsRepository';
import {PROFILE} from '../constants/events';
import type {AppSettings} from '../types';
import {DEFAULT_MAX_FAILED_ATTEMPTS} from '../utils/unlockPolicy';

export async function loadSettings(userId: number): Promise<AppSettings> {
  const row = await getUserSettings(userId);
  return {
    displayName: row?.display_name ?? PROFILE.displayName,
    biometricEnabled: Boolean(row?.biometric_enabled ?? 1),
    notificationsEnabled: Boolean(row?.notifications_enabled ?? 1),
    voiceEnabled: Boolean(row?.voice_enabled ?? 1),
    theme: row?.theme === 'light' ? 'light' : 'dark',
    maxFailedAttempts: row?.max_failed_attempts ?? DEFAULT_MAX_FAILED_ATTEMPTS,
  };
}

export async function saveSettings(
  userId: number,
  patch: Partial<AppSettings>,
): Promise<void> {
  await updateUserSettings(userId, patch);
}
