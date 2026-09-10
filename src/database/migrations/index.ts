import { database } from '../database';
import { migrate001InitialSchema } from './001_initial_schema';
import { migrate002StayAllowedAndSettings } from './002_stay_allowed_and_settings';
import { migrate003MaxFailedAttempts } from './003_max_failed_attempts';

const CURRENT_VERSION = 3;

async function getDatabaseVersion(): Promise<number> {
  const result = await database.execute('PRAGMA user_version;');

  const row = result.rows?.[0] as { user_version?: number } | undefined;

  return row?.user_version ?? 0;
}

async function setDatabaseVersion(version: number): Promise<void> {
  await database.execute(`PRAGMA user_version = ${version};`);
}

export async function runMigrations(): Promise<void> {
  const currentVersion = await getDatabaseVersion();

  if (currentVersion < 1) {
    await migrate001InitialSchema();
    await setDatabaseVersion(1);
  }

  if (currentVersion < 2) {
    await migrate002StayAllowedAndSettings();
    await setDatabaseVersion(2);
  }

  if (currentVersion < 3) {
    await migrate003MaxFailedAttempts();
    await setDatabaseVersion(CURRENT_VERSION);
  }
}
