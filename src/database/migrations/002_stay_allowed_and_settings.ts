import { database } from '../database';

export async function migrate002StayAllowedAndSettings(): Promise<void> {
  await database.execute(`
    CREATE TABLE IF NOT EXISTS stay_allowed_apps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stay_session_id INTEGER NOT NULL,
      package_name TEXT NOT NULL,

      FOREIGN KEY (stay_session_id)
        REFERENCES stay_sessions(id)
        ON DELETE CASCADE,

      UNIQUE(stay_session_id, package_name)
    );

    CREATE TABLE IF NOT EXISTS user_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      biometric_enabled INTEGER NOT NULL DEFAULT 1,
      notifications_enabled INTEGER NOT NULL DEFAULT 1,
      voice_enabled INTEGER NOT NULL DEFAULT 1,
      theme TEXT NOT NULL DEFAULT 'dark',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,

      FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_stay_allowed_session
      ON stay_allowed_apps(stay_session_id);

    CREATE INDEX IF NOT EXISTS idx_user_settings_user
      ON user_settings(user_id);
  `);
}
