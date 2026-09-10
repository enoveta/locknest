import {
  addGuestAllowedApp,
  createGuestSession,
  endActiveGuestSession,
  getActiveGuestSession,
  getGuestAllowedApps,
  removeGuestAllowedApp,
} from '../database/repositories/guestSessionRepository';
import {createSecurityEvent} from '../database/repositories/securityRepository';
import {findCatalogApp} from '../constants/apps';
import {EVENT_TYPES} from '../constants/events';
import {syncAccessPolicy} from './installedAppsService';

const DEFAULT_GUEST_ALLOWED = ['Phone', 'Messages', 'Chrome'];

function expiresInMinutes(minutes: number): string {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

export async function isGuestModeActive(userId: number): Promise<boolean> {
  const session = await getActiveGuestSession(userId);
  if (session?.expires_at && new Date(session.expires_at).getTime() <= Date.now()) {
    await endActiveGuestSession(userId);
    await syncAccessPolicy(null, []);
    return false;
  }
  if (!session) {
    await syncAccessPolicy(null, []);
  }
  return Boolean(session);
}

export async function getGuestSessionInfo(userId: number) {
  const session = await getActiveGuestSession(userId);
  if (!session) {
    await syncAccessPolicy(null, []);
    return null;
  }
  if (session.expires_at && new Date(session.expires_at).getTime() <= Date.now()) {
    await endActiveGuestSession(userId);
    await syncAccessPolicy(null, []);
    return null;
  }

  const allowed = await getGuestAllowedApps(session.id);
  await syncAccessPolicy(
    'guest',
    allowed.map(row => row.package_name),
  );
  return {
    session,
    allowedNames: allowed.map(
      row => findCatalogApp(row.package_name)?.name ?? row.package_name,
    ),
  };
}

export async function activateGuestMode(
  userId: number,
  allowedNames: string[] = DEFAULT_GUEST_ALLOWED,
  durationMinutes = 240,
): Promise<void> {
  await endActiveGuestSession(userId);
  const sessionId = await createGuestSession(userId, expiresInMinutes(durationMinutes));

  for (const name of allowedNames) {
    const catalog = findCatalogApp(name);
    await addGuestAllowedApp(
      sessionId,
      catalog?.packageName ?? name.toLowerCase(),
    );
  }
  await syncAccessPolicy(
    'guest',
    allowedNames.map(name => findCatalogApp(name)?.packageName ?? name),
  );

  await createSecurityEvent(
    userId,
    EVENT_TYPES.GUEST_ACTIVATED,
    undefined,
    'Guest Mode enabled',
  );
}

export async function deactivateGuestMode(userId: number): Promise<void> {
  await endActiveGuestSession(userId);
  await syncAccessPolicy(null, []);
  await createSecurityEvent(
    userId,
    EVENT_TYPES.GUEST_DEACTIVATED,
    undefined,
    'Guest Mode disabled',
  );
}

export async function addGuestAllowed(
  userId: number,
  appName: string,
): Promise<void> {
  let session = await getActiveGuestSession(userId);
  if (!session) {
    await activateGuestMode(userId);
    session = await getActiveGuestSession(userId);
  }
  if (!session) {
    return;
  }

  const catalog = findCatalogApp(appName);
  await addGuestAllowedApp(
    session.id,
    catalog?.packageName ?? appName.toLowerCase(),
  );
}

export async function removeGuestAllowed(
  userId: number,
  appName: string,
): Promise<void> {
  const session = await getActiveGuestSession(userId);
  if (!session) {
    return;
  }
  const catalog = findCatalogApp(appName);
  await removeGuestAllowedApp(
    session.id,
    catalog?.packageName ?? appName.toLowerCase(),
  );
}
