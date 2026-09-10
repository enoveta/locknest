import { database } from '../database';

export interface SecurityEvent {
  id: number;
  user_id: number;
  event_type: string;
  package_name: string | null;
  description: string | null;
  created_at: string;
}

export interface AuthAttempt {
  id: number;
  security_event_id: number;
  package_name: string | null;
  method: string;
  successful: number;
  attempted_at: string;
}

export interface IntruderEvidence {
  id: number;
  security_event_id: number;
  file_path: string;
  captured_at: string;
  is_viewed: number;
  deleted_at: string | null;
}

/**
 * Create a security event.
 */
export async function createSecurityEvent(
  userId: number,
  eventType: string,
  packageName?: string,
  description?: string,
): Promise<number> {
  const now = new Date().toISOString();

  const result = await database.execute(
    `
      INSERT INTO security_events (
        user_id,
        event_type,
        package_name,
        description,
        created_at
      )
      VALUES (?, ?, ?, ?, ?);
    `,
    [
      userId,
      eventType,
      packageName ?? null,
      description ?? null,
      now,
    ],
  );

  return result.insertId ?? 0;
}

/**
 * Get one security event by ID.
 */
export async function getSecurityEventById(
  id: number,
): Promise<SecurityEvent | null> {
  const result = await database.execute(
    `
      SELECT *
      FROM security_events
      WHERE id = ?
      LIMIT 1;
    `,
    [id],
  );

  return (
    (result.rows?.[0] as unknown as SecurityEvent | undefined) ?? null
  );
}

/**
 * Get all security events belonging to a user.
 */
export async function getSecurityEventsByUser(
  userId: number,
): Promise<SecurityEvent[]> {
  const result = await database.execute(
    `
      SELECT *
      FROM security_events
      WHERE user_id = ?
      ORDER BY created_at DESC;
    `,
    [userId],
  );

  return (result.rows ?? []) as unknown as SecurityEvent[];
}

/**
 * Create an authentication attempt.
 */
export async function createAuthAttempt(
  securityEventId: number,
  method: string,
  successful: boolean,
  packageName?: string,
): Promise<number> {
  const now = new Date().toISOString();

  const result = await database.execute(
    `
      INSERT INTO auth_attempts (
        security_event_id,
        package_name,
        method,
        successful,
        attempted_at
      )
      VALUES (?, ?, ?, ?, ?);
    `,
    [
      securityEventId,
      packageName ?? null,
      method,
      successful ? 1 : 0,
      now,
    ],
  );

  return result.insertId ?? 0;
}

/**
 * Get authentication attempts for a security event.
 */
export async function getAuthAttemptsByEvent(
  securityEventId: number,
): Promise<AuthAttempt[]> {
  const result = await database.execute(
    `
      SELECT *
      FROM auth_attempts
      WHERE security_event_id = ?
      ORDER BY attempted_at ASC;
    `,
    [securityEventId],
  );

  return (result.rows ?? []) as unknown as AuthAttempt[];
}

/**
 * Create a reference to intruder evidence.
 *
 * The actual image is NOT stored in SQLite.
 * Only its private application-storage path is stored.
 */
export async function createIntruderEvidence(
  securityEventId: number,
  filePath: string,
): Promise<number> {
  const now = new Date().toISOString();

  const result = await database.execute(
    `
      INSERT INTO intruder_evidence (
        security_event_id,
        file_path,
        captured_at,
        is_viewed
      )
      VALUES (?, ?, ?, 0);
    `,
    [securityEventId, filePath, now],
  );

  return result.insertId ?? 0;
}

/**
 * Get one intruder evidence record.
 */
export async function getIntruderEvidenceById(
  id: number,
): Promise<IntruderEvidence | null> {
  const result = await database.execute(
    `
      SELECT *
      FROM intruder_evidence
      WHERE id = ?
      LIMIT 1;
    `,
    [id],
  );

  return (
    (result.rows?.[0] as unknown as IntruderEvidence | undefined) ?? null
  );
}

/**
 * Get all evidence belonging to a security event.
 */
export async function getIntruderEvidenceByEvent(
  securityEventId: number,
): Promise<IntruderEvidence[]> {
  const result = await database.execute(
    `
      SELECT *
      FROM intruder_evidence
      WHERE security_event_id = ?
      ORDER BY captured_at DESC;
    `,
    [securityEventId],
  );

  return (result.rows ?? []) as unknown as IntruderEvidence[];
}

/**
 * Mark intruder evidence as viewed.
 */
export async function markEvidenceAsViewed(
  id: number,
): Promise<void> {
  await database.execute(
    `
      UPDATE intruder_evidence
      SET is_viewed = 1
      WHERE id = ?;
    `,
    [id],
  );
}

/**
 * Get the newest undeleted intruder evidence for a user.
 */
export async function getLatestIntruderEvidence(
  userId: number,
): Promise<IntruderEvidence | null> {
  const result = await database.execute(
    `
      SELECT evidence.*
      FROM intruder_evidence evidence
      INNER JOIN security_events events
        ON events.id = evidence.security_event_id
      WHERE events.user_id = ?
        AND evidence.deleted_at IS NULL
      ORDER BY evidence.captured_at DESC
      LIMIT 1;
    `,
    [userId],
  );

  return (
    (result.rows?.[0] as unknown as IntruderEvidence | undefined) ?? null
  );
}

/**
 * Mark older undeleted evidence as deleted, keeping the newest records.
 */
export async function markOldEvidenceDeleted(
  keepCount: number,
): Promise<string[]> {
  const result = await database.execute(
    `
      SELECT id, file_path
      FROM intruder_evidence
      WHERE deleted_at IS NULL
      ORDER BY captured_at DESC;
    `,
  );
  const rows = (result.rows ?? []) as unknown as Array<{
    id: number;
    file_path: string;
  }>;
  const extra = rows.slice(Math.max(keepCount, 0));
  const now = new Date().toISOString();
  for (const row of extra) {
    await database.execute(
      `
        UPDATE intruder_evidence
        SET deleted_at = ?
        WHERE id = ?;
      `,
      [now, row.id],
    );
  }
  return extra.map(row => row.file_path);
}

/**
 * Mark intruder evidence as deleted.
 *
 * The actual file should be removed separately from
 * private application storage.
 */
export async function markEvidenceAsDeleted(
  id: number,
): Promise<void> {
  const now = new Date().toISOString();

  await database.execute(
    `
      UPDATE intruder_evidence
      SET deleted_at = ?
      WHERE id = ?;
    `,
    [now, id],
  );
}