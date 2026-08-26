import { database } from '../database';

export type User = {
  id: number;
  device_id: string;
  created_at: string;
  updated_at: string;
};

export type CreateUserInput = {
  deviceId: string;
};

function now(): string {
  return new Date().toISOString();
}

export async function createUser(
  input: CreateUserInput,
): Promise<User> {
  const timestamp = now();

  const result = await database.execute(
    `
      INSERT INTO users (
        device_id,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?)
    `,
    [input.deviceId, timestamp, timestamp],
  );

  const userId = Number(result.insertId);

  const user = await getUserById(userId);

  if (!user) {
    throw new Error('Failed to create user');
  }

  return user;
}

export async function getUserById(
  id: number,
): Promise<User | null> {
  const result = await database.execute(
    `
      SELECT
        id,
        device_id,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
    [id],
  );

  const row = result.rows?.[0];

  return row ? (row as User) : null;
}

export async function getUserByDeviceId(
  deviceId: string,
): Promise<User | null> {
  const result = await database.execute(
    `
      SELECT
        id,
        device_id,
        created_at,
        updated_at
      FROM users
      WHERE device_id = ?
      LIMIT 1
    `,
    [deviceId],
  );

  const row = result.rows?.[0];

  return row ? (row as User) : null;
}

export async function updateUser(
  id: number,
  deviceId: string,
): Promise<User | null> {
  const timestamp = now();

  await database.execute(
    `
      UPDATE users
      SET
        device_id = ?,
        updated_at = ?
      WHERE id = ?
    `,
    [deviceId, timestamp, id],
  );

  return getUserById(id);
}

export async function deleteUser(id: number): Promise<void> {
  await database.execute(
    `
      DELETE FROM users
      WHERE id = ?
    `,
    [id],
  );
}