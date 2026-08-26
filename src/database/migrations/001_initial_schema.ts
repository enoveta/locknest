import { database } from '../database';

export async function migrate001InitialSchema(): Promise<void> {
  await database.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS protected_apps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      package_name TEXT NOT NULL,
      app_name TEXT NOT NULL,
      is_locked INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,

      FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

      UNIQUE(user_id, package_name)
    );

    CREATE TABLE IF NOT EXISTS lock_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      protected_app_id INTEGER NOT NULL,
      auth_method TEXT NOT NULL,
      biometric_enabled INTEGER NOT NULL DEFAULT 0,
      max_attempts INTEGER NOT NULL DEFAULT 5,
      intruder_detection_enabled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,

      FOREIGN KEY (protected_app_id)
        REFERENCES protected_apps(id)
        ON DELETE CASCADE,

      UNIQUE(protected_app_id)
    );

    CREATE TABLE IF NOT EXISTS stay_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      package_name TEXT NOT NULL,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,

      FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS guest_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      expires_at TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,

      FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS guest_allowed_apps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guest_session_id INTEGER NOT NULL,
      package_name TEXT NOT NULL,

      FOREIGN KEY (guest_session_id)
        REFERENCES guest_sessions(id)
        ON DELETE CASCADE,

      UNIQUE(guest_session_id, package_name)
    );

    CREATE TABLE IF NOT EXISTS security_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      event_type TEXT NOT NULL,
      package_name TEXT,
      description TEXT,
      created_at TEXT NOT NULL,

      FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS auth_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      security_event_id INTEGER NOT NULL,
      package_name TEXT,
      method TEXT NOT NULL,
      successful INTEGER NOT NULL,
      attempted_at TEXT NOT NULL,

      FOREIGN KEY (security_event_id)
        REFERENCES security_events(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS intruder_evidence (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      security_event_id INTEGER NOT NULL,
      file_path TEXT NOT NULL,
      captured_at TEXT NOT NULL,
      is_viewed INTEGER NOT NULL DEFAULT 0,
      deleted_at TEXT,

      FOREIGN KEY (security_event_id)
        REFERENCES security_events(id)
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_protected_apps_user
      ON protected_apps(user_id);

    CREATE INDEX IF NOT EXISTS idx_protected_apps_package
      ON protected_apps(package_name);

    CREATE INDEX IF NOT EXISTS idx_security_events_user
      ON security_events(user_id);

    CREATE INDEX IF NOT EXISTS idx_security_events_created
      ON security_events(created_at);

    CREATE INDEX IF NOT EXISTS idx_auth_attempts_event
      ON auth_attempts(security_event_id);

    CREATE INDEX IF NOT EXISTS idx_evidence_event
      ON intruder_evidence(security_event_id);
  `);
}