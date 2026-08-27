import { database } from '../database';

export interface StaySession {
  id: number;
  user_id: number;
  package_name: string;
  started_at: string;
  ended_at: string | null;
  is_active: number;
}

/**
 * Start a new Stay Mode session.
 */
export async function createStaySession(
  userId: number,
  packageName: string,
): Promise<number> {
  const now = new Date().toISOString();

  const result = await database.execute(
    `
      INSERT INTO stay_sessions (
        user_id,
        package_name,
        started_at,
        ended_at,
        is_active
      )
      VALUES (?, ?, ?, NULL, 1);
    `,
    [userId, packageName, now],
  );

  return result.insertId ?? 0;
}

/**
 * Get a Stay Mode session by ID.
 */
export async function getStaySessionById(
  id: number,
): Promise<StaySession | null> {
  const result = await database.execute(
    `
      SELECT *
      FROM stay_sessions
      WHERE id = ?
      LIMIT 1;
    `,
    [id],
  );

  return (
    (result.rows?.[0] as unknown as StaySession | undefined) ?? null
  );
}

/**
 * Get the currently active Stay Mode session for a user.
 */
export async function getActiveStaySession(
  userId: number,
): Promise<StaySession | null> {
  const result = await database.execute(
    `
      SELECT *
      FROM stay_sessions
      WHERE user_id = ?
        AND is_active = 1
      ORDER BY started_at DESC
      LIMIT 1;
    `,
    [userId],
  );

  return (
    (result.rows?.[0] as unknown as StaySession | undefined) ?? null
  );
}

/**
 * Get all Stay Mode sessions for a user.
 */
export async function getStaySessionsByUser(
  userId: number,
): Promise<StaySession[]> {
  const result = await database.execute(
    `
      SELECT *
      FROM stay_sessions
      WHERE user_id = ?
      ORDER BY started_at DESC;
    `,
    [userId],
  );

  return (result.rows ?? []) as unknown as StaySession[];
}

/**
 * End a Stay Mode session.
 */
export async function endStaySession(
  id: number,
): Promise<void> {
  const now = new Date().toISOString();

  await database.execute(
    `
      UPDATE stay_sessions
      SET
        ended_at = ?,
        is_active = 0
      WHERE id = ?
        AND is_active = 1;
    `,
    [now, id],
  );
}

/**
 * End any active Stay Mode session for a user.
 *
 * This is useful before starting another Stay Mode session
 * so that only one session remains active.
 */
export async function endActiveStaySession(
  userId: number,
): Promise<void> {
  const now = new Date().toISOString();

  await database.execute(
    `
      UPDATE stay_sessions
      SET
        ended_at = ?,
        is_active = 0
      WHERE user_id = ?
        AND is_active = 1;
    `,
    [now, userId],
  );
}