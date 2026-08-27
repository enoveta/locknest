import { database } from '../database';

export interface GuestSession {
  id: number;
  user_id: number;
  started_at: string;
  ended_at: string | null;
  expires_at: string | null;
  is_active: number;
}

export interface GuestAllowedApp {
  id: number;
  guest_session_id: number;
  package_name: string;
}

/**
 * Create a new Guest Mode session.
 */
export async function createGuestSession(
  userId: number,
  expiresAt?: string,
): Promise<number> {
  const now = new Date().toISOString();

  const result = await database.execute(
    `
      INSERT INTO guest_sessions (
        user_id,
        started_at,
        ended_at,
        expires_at,
        is_active
      )
      VALUES (?, ?, NULL, ?, 1);
    `,
    [userId, now, expiresAt ?? null],
  );

  return result.insertId ?? 0;
}

/**
 * Get a Guest Mode session by ID.
 */
export async function getGuestSessionById(
  id: number,
): Promise<GuestSession | null> {
  const result = await database.execute(
    `
      SELECT *
      FROM guest_sessions
      WHERE id = ?
      LIMIT 1;
    `,
    [id],
  );

  return (
    (result.rows?.[0] as unknown as GuestSession | undefined) ?? null
  );
}

/**
 * Get the currently active Guest Mode session for a user.
 */
export async function getActiveGuestSession(
  userId: number,
): Promise<GuestSession | null> {
  const result = await database.execute(
    `
      SELECT *
      FROM guest_sessions
      WHERE user_id = ?
        AND is_active = 1
      ORDER BY started_at DESC
      LIMIT 1;
    `,
    [userId],
  );

  return (
    (result.rows?.[0] as unknown as GuestSession | undefined) ?? null
  );
}

/**
 * Get all Guest Mode sessions for a user.
 */
export async function getGuestSessionsByUser(
  userId: number,
): Promise<GuestSession[]> {
  const result = await database.execute(
    `
      SELECT *
      FROM guest_sessions
      WHERE user_id = ?
      ORDER BY started_at DESC;
    `,
    [userId],
  );

  return (result.rows ?? []) as unknown as GuestSession[];
}

/**
 * End a Guest Mode session.
 */
export async function endGuestSession(
  id: number,
): Promise<void> {
  const now = new Date().toISOString();

  await database.execute(
    `
      UPDATE guest_sessions
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
 * End any active Guest Mode session for a user.
 */
export async function endActiveGuestSession(
  userId: number,
): Promise<void> {
  const now = new Date().toISOString();

  await database.execute(
    `
      UPDATE guest_sessions
      SET
        ended_at = ?,
        is_active = 0
      WHERE user_id = ?
        AND is_active = 1;
    `,
    [now, userId],
  );
}

/**
 * Add an application to the Guest Mode allow-list.
 */
export async function addGuestAllowedApp(
  guestSessionId: number,
  packageName: string,
): Promise<number> {
  const result = await database.execute(
    `
      INSERT INTO guest_allowed_apps (
        guest_session_id,
        package_name
      )
      VALUES (?, ?);
    `,
    [guestSessionId, packageName],
  );

  return result.insertId ?? 0;
}

/**
 * Get all applications allowed during a Guest Mode session.
 */
export async function getGuestAllowedApps(
  guestSessionId: number,
): Promise<GuestAllowedApp[]> {
  const result = await database.execute(
    `
      SELECT *
      FROM guest_allowed_apps
      WHERE guest_session_id = ?
      ORDER BY package_name ASC;
    `,
    [guestSessionId],
  );

  return (result.rows ?? []) as unknown as GuestAllowedApp[];
}

/**
 * Remove an application from the Guest Mode allow-list.
 */
export async function removeGuestAllowedApp(
  guestSessionId: number,
  packageName: string,
): Promise<void> {
  await database.execute(
    `
      DELETE FROM guest_allowed_apps
      WHERE guest_session_id = ?
        AND package_name = ?;
    `,
    [guestSessionId, packageName],
  );
}

/**
 * Remove all allowed applications from a Guest Mode session.
 */
export async function clearGuestAllowedApps(
  guestSessionId: number,
): Promise<void> {
  await database.execute(
    `
      DELETE FROM guest_allowed_apps
      WHERE guest_session_id = ?;
    `,
    [guestSessionId],
  );
}