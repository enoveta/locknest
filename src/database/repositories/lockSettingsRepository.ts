import { database } from '../database';

export interface LockSettings {
  id: number;
  protected_app_id: number;
  auth_method: string;
  biometric_enabled: number;
  max_attempts: number;
  intruder_detection_enabled: number;
  created_at: string;
  updated_at: string;
}

export async function createLockSettings(
  protectedAppId: number,
  authMethod: string,
  biometricEnabled = false,
  maxAttempts = 5,
  intruderDetectionEnabled = true,
): Promise<number> {
  const now = new Date().toISOString();

  const result = await database.execute(
    `
      INSERT INTO lock_settings (
        protected_app_id,
        auth_method,
        biometric_enabled,
        max_attempts,
        intruder_detection_enabled,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
    [
      protectedAppId,
      authMethod,
      biometricEnabled ? 1 : 0,
      maxAttempts,
      intruderDetectionEnabled ? 1 : 0,
      now,
      now,
    ],
  );

  return result.insertId ?? 0;
}

export async function getLockSettingsById(
  id: number,
): Promise<LockSettings | null> {
  const result = await database.execute(
    `
      SELECT *
      FROM lock_settings
      WHERE id = ?
      LIMIT 1;
    `,
    [id],
  );

  return (
    (result.rows?.[0] as unknown as LockSettings | undefined) ?? null
  );
}

export async function getLockSettingsByApp(
  protectedAppId: number,
): Promise<LockSettings | null> {
  const result = await database.execute(
    `
      SELECT *
      FROM lock_settings
      WHERE protected_app_id = ?
      LIMIT 1;
    `,
    [protectedAppId],
  );

  return (
    (result.rows?.[0] as unknown as LockSettings | undefined) ?? null
  );
}

export async function updateLockSettings(
  id: number,
  authMethod: string,
  biometricEnabled: boolean,
  maxAttempts: number,
  intruderDetectionEnabled: boolean,
): Promise<void> {
  const now = new Date().toISOString();

  await database.execute(
    `
      UPDATE lock_settings
      SET
        auth_method = ?,
        biometric_enabled = ?,
        max_attempts = ?,
        intruder_detection_enabled = ?,
        updated_at = ?
      WHERE id = ?;
    `,
    [
      authMethod,
      biometricEnabled ? 1 : 0,
      maxAttempts,
      intruderDetectionEnabled ? 1 : 0,
      now,
      id,
    ],
  );
}

export async function deleteLockSettings(id: number): Promise<void> {
  await database.execute(
    `
      DELETE FROM lock_settings
      WHERE id = ?;
    `,
    [id],
  );
}