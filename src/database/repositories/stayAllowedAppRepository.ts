import { database } from '../database';

export type StayAllowedApp = {
  id: number;
  stay_session_id: number;
  package_name: string;
};

export async function addStayAllowedApp(
  staySessionId: number,
  packageName: string,
): Promise<number> {
  const result = await database.execute(
    `
      INSERT INTO stay_allowed_apps (
        stay_session_id,
        package_name
      )
      VALUES (?, ?);
    `,
    [staySessionId, packageName],
  );

  return result.insertId ?? 0;
}

export async function getStayAllowedApps(
  staySessionId: number,
): Promise<StayAllowedApp[]> {
  const result = await database.execute(
    `
      SELECT *
      FROM stay_allowed_apps
      WHERE stay_session_id = ?
      ORDER BY package_name ASC;
    `,
    [staySessionId],
  );

  return (result.rows ?? []) as unknown as StayAllowedApp[];
}

export async function removeStayAllowedApp(
  staySessionId: number,
  packageName: string,
): Promise<void> {
  await database.execute(
    `
      DELETE FROM stay_allowed_apps
      WHERE stay_session_id = ?
        AND package_name = ?;
    `,
    [staySessionId, packageName],
  );
}

export async function clearStayAllowedApps(
  staySessionId: number,
): Promise<void> {
  await database.execute(
    `
      DELETE FROM stay_allowed_apps
      WHERE stay_session_id = ?;
    `,
    [staySessionId],
  );
}
