import { database } from '../database';

export async function migrate003MaxFailedAttempts(): Promise<void> {
  try {
    await database.execute(`
      ALTER TABLE user_settings
      ADD COLUMN max_failed_attempts INTEGER NOT NULL DEFAULT 3;
    `);
  } catch (error) {
    const message = String(error);
    if (!message.toLowerCase().includes('duplicate column')) {
      throw error;
    }
  }
}
