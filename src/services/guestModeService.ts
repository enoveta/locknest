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

const DEFAULT_GUEST_ALLOWED = ['Phone', 'Messages', 'Chrome'];

function expiresInHours(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

export async function isGuestModeActive(userId: number): Promise<boolean> {
  const session = await getActiveGuestSession(userId);
  return Boolean(session);
}

export async function getGuestSessionInfo(userId: number) {
  const session = await getActiveGuestSession(userId);
  if (!session) {
    return null;
  }

  const allowed = await getGuestAllowedApps(session.id);
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
  hours = 4,
): Promise<void> {
  await endActiveGuestSession(userId);
  const sessionId = await createGuestSession(userId, expiresInHours(hours));

  for (const name of allowedNames) {
    const catalog = findCatalogApp(name);
    await addGuestAllowedApp(
      sessionId,
      catalog?.packageName ?? name.toLowerCase(),
    );
  }

  await createSecurityEvent(
    userId,
    EVENT_TYPES.GUEST_ACTIVATED,
    undefined,
    'Guest Mode enabled',
  );
}

export async function deactivateGuestMode(userId: number): Promise<void> {
  await endActiveGuestSession(userId);
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
