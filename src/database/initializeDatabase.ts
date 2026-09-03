import { runMigrations } from './migrations';
import { database } from './database';

let initialized = false;

export async function initializeDatabase(): Promise<void> {
  if (initialized) {
    return;
  }

  await database.execute('PRAGMA foreign_keys = ON;');
  await runMigrations();

  initialized = true;
}
