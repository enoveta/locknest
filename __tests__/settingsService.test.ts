import {loadSettings} from '../src/services/settingsService';

jest.mock('../src/database/repositories/userSettingsRepository', () => ({
  getUserSettings: jest.fn(async () => ({
    display_name: 'Test User',
    biometric_enabled: 0,
    notifications_enabled: 1,
    voice_enabled: 1,
    theme: 'dark',
    max_failed_attempts: 5,
  })),
  updateUserSettings: jest.fn(),
}));

describe('settingsService', () => {
  it('maps stored failed-attempt and toggle values', async () => {
    const settings = await loadSettings(1);
    expect(settings.maxFailedAttempts).toBe(5);
    expect(settings.biometricEnabled).toBe(false);
    expect(settings.notificationsEnabled).toBe(true);
    expect(settings.voiceEnabled).toBe(true);
  });
});
