import {
  createStaySession,
  endActiveStaySession,
  getActiveStaySession,
} from '../database/repositories/staySessionRepository';
import {
  addStayAllowedApp,
  clearStayAllowedApps,
  getStayAllowedApps,
  removeStayAllowedApp,
} from '../database/repositories/stayAllowedAppRepository';
import {createSecurityEvent} from '../database/repositories/securityRepository';
import {
  DEFAULT_STAY_ALLOWED,
  STAY_MODE_PACKAGE,
  findCatalogApp,
} from '../constants/apps';
import {EVENT_TYPES} from '../constants/events';
import {syncAccessPolicy} from './installedAppsService';

export async function isStayModeActive(userId: number): Promise<boolean> {
  const session = await getActiveStaySession(userId);
  return Boolean(session);
}

export async function getStayAllowedNames(userId: number): Promise<string[]> {
  const session = await getActiveStaySession(userId);
  if (!session) {
    await syncAccessPolicy(null, []);
    return DEFAULT_STAY_ALLOWED;
  }

  const rows = await getStayAllowedApps(session.id);
  if (rows.length === 0) {
    return DEFAULT_STAY_ALLOWED;
  }

  const allowedNames = rows
    .map(row => findCatalogApp(row.package_name)?.name ?? row.package_name)
    .filter(Boolean);
  await syncAccessPolicy(
    'stay',
    rows.map(row => row.package_name),
  );
  return allowedNames;
}

export async function activateStayMode(
  userId: number,
  allowedNames: string[] = DEFAULT_STAY_ALLOWED,
): Promise<void> {
  await endActiveStaySession(userId);
  const sessionId = await createStaySession(userId, STAY_MODE_PACKAGE);
  await clearStayAllowedApps(sessionId);

  for (const name of allowedNames) {
    const catalog = findCatalogApp(name);
    await addStayAllowedApp(
      sessionId,
      catalog?.packageName ?? name.toLowerCase(),
    );
  }
  await syncAccessPolicy(
    'stay',
    allowedNames.map(name => findCatalogApp(name)?.packageName ?? name),
  );

  await createSecurityEvent(
    userId,
    EVENT_TYPES.STAY_ACTIVATED,
    STAY_MODE_PACKAGE,
    'Stay Mode enabled',
  );
}

export async function deactivateStayMode(userId: number): Promise<void> {
  await endActiveStaySession(userId);
  await syncAccessPolicy(null, []);
  await createSecurityEvent(
    userId,
    EVENT_TYPES.STAY_DEACTIVATED,
    STAY_MODE_PACKAGE,
    'Stay Mode disabled',
  );
}

export async function addStayAllowed(
  userId: number,
  appName: string,
): Promise<void> {
  let session = await getActiveStaySession(userId);
  if (!session) {
    await activateStayMode(userId);
    session = await getActiveStaySession(userId);
  }
  if (!session) {
    return;
  }

  const catalog = findCatalogApp(appName);
  await addStayAllowedApp(
    session.id,
    catalog?.packageName ?? appName.toLowerCase(),
  );
}

export async function removeStayAllowed(
  userId: number,
  appName: string,
): Promise<void> {
  const session = await getActiveStaySession(userId);
  if (!session) {
    return;
  }
  const catalog = findCatalogApp(appName);
  await removeStayAllowedApp(
    session.id,
    catalog?.packageName ?? appName.toLowerCase(),
  );
}
