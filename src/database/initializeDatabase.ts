import { runMigrations } from './migrations';

let initialized = false;

export async function initializeDatabase(): Promise<void> {
  if (initialized) {
    return;
  }

  await runMigrations();

  initialized = true;
}