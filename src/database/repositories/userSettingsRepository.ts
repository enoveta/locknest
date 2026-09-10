import { database } from '../database';

export type UserSettingsRow = {
  id: number;
  user_id: number;
  display_name: string;
  biometric_enabled: number;
  notifications_enabled: number;
  voice_enabled: number;
  theme: string;
  max_failed_attempts: number;
  created_at: string;
  updated_at: string;
};

export async function createUserSettings(
  userId: number,
  displayName: string,
): Promise<number> {
  const now = new Date().toISOString();

  const result = await database.execute(
    `
      INSERT INTO user_settings (
        user_id,
        display_name,
        biometric_enabled,
        notifications_enabled,
        voice_enabled,
        theme,
        max_failed_attempts,
        created_at,
        updated_at
      )
      VALUES (?, ?, 1, 1, 1, 'dark', 3, ?, ?);
    `,
    [userId, displayName, now, now],
  );

  return result.insertId ?? 0;
}

export async function getUserSettings(
  userId: number,
): Promise<UserSettingsRow | null> {
  const result = await database.execute(
    `
      SELECT *
      FROM user_settings
      WHERE user_id = ?
      LIMIT 1;
    `,
    [userId],
  );

  return (
    (result.rows?.[0] as unknown as UserSettingsRow | undefined) ?? null
  );
}

export async function updateUserSettings(
  userId: number,
  patch: {
    displayName?: string;
    biometricEnabled?: boolean;
    notificationsEnabled?: boolean;
    voiceEnabled?: boolean;
    theme?: string;
    maxFailedAttempts?: number;
  },
): Promise<void> {
  const current = await getUserSettings(userId);
  if (!current) {
    return;
  }

  const now = new Date().toISOString();
  await database.execute(
    `
      UPDATE user_settings
      SET
        display_name = ?,
        biometric_enabled = ?,
        notifications_enabled = ?,
        voice_enabled = ?,
        theme = ?,
        max_failed_attempts = ?,
        updated_at = ?
      WHERE user_id = ?;
    `,
    [
      patch.displayName ?? current.display_name,
      patch.biometricEnabled === undefined
        ? current.biometric_enabled
        : patch.biometricEnabled
          ? 1
          : 0,
      patch.notificationsEnabled === undefined
        ? current.notifications_enabled
        : patch.notificationsEnabled
          ? 1
          : 0,
      patch.voiceEnabled === undefined
        ? current.voice_enabled
        : patch.voiceEnabled
          ? 1
          : 0,
      patch.theme ?? current.theme,
      patch.maxFailedAttempts ?? current.max_failed_attempts ?? 3,
      now,
      userId,
    ],
  );
}
