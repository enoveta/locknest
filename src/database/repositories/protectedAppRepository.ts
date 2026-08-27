import { database } from '../database';

export interface ProtectedApp {
  id: number;
  user_id: number;
  package_name: string;
  app_name: string;
  is_locked: number;
  created_at: string;
  updated_at: string;
}

export async function createProtectedApp(
  userId: number,
  packageName: string,
  appName: string,
): Promise<number> {
  const now = new Date().toISOString();

  const result = await database.execute(
    `
      INSERT INTO protected_apps (
        user_id,
        package_name,
        app_name,
        is_locked,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, 1, ?, ?);
    `,
    [userId, packageName, appName, now, now],
  );

  return result.insertId ?? 0;
}

export async function getProtectedAppById(
  id: number,
): Promise<ProtectedApp | null> {
  const result = await database.execute(
    `
      SELECT *
      FROM protected_apps
      WHERE id = ?
      LIMIT 1;
    `,
    [id],
  );

  return (
    (result.rows?.[0] as unknown as ProtectedApp | undefined) ?? null
  );
}

export async function getProtectedAppsByUser(
  userId: number,
): Promise<ProtectedApp[]> {
  const result = await database.execute(
    `
      SELECT *
      FROM protected_apps
      WHERE user_id = ?
      ORDER BY app_name ASC;
    `,
    [userId],
  );

  return (result.rows ?? []) as unknown as ProtectedApp[];
}

export async function getProtectedAppByPackageName(
  userId: number,
  packageName: string,
): Promise<ProtectedApp | null> {
  const result = await database.execute(
    `
      SELECT *
      FROM protected_apps
      WHERE user_id = ?
        AND package_name = ?
      LIMIT 1;
    `,
    [userId, packageName],
  );

  return (
    (result.rows?.[0] as unknown as ProtectedApp | undefined) ?? null
  );
}

export async function updateProtectedApp(
  id: number,
  appName: string,
  isLocked: boolean,
): Promise<void> {
  const now = new Date().toISOString();

  await database.execute(
    `
      UPDATE protected_apps
      SET
        app_name = ?,
        is_locked = ?,
        updated_at = ?
      WHERE id = ?;
    `,
    [appName, isLocked ? 1 : 0, now, id],
  );
}

export async function deleteProtectedApp(id: number): Promise<void> {
  await database.execute(
    `
      DELETE FROM protected_apps
      WHERE id = ?;
    `,
    [id],
  );
}