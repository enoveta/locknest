import {
  createProtectedApp,
  deleteProtectedApp,
  getProtectedAppByPackageName,
  getProtectedAppsByUser,
  updateProtectedApp,
  type ProtectedApp,
} from '../database/repositories/protectedAppRepository';
import {createLockSettings} from '../database/repositories/lockSettingsRepository';
import {createSecurityEvent} from '../database/repositories/securityRepository';
import {
  APP_CATALOG,
  DEFAULT_LOCKED_APPS,
  findCatalogApp,
} from '../constants/apps';
import {EVENT_TYPES} from '../constants/events';

export async function seedDefaultLockedApps(userId: number): Promise<void> {
  const existing = await getProtectedAppsByUser(userId);
  if (existing.length > 0) {
    return;
  }

  for (const name of DEFAULT_LOCKED_APPS) {
    const catalog = findCatalogApp(name);
    if (!catalog) {
      continue;
    }
    const id = await createProtectedApp(
      userId,
      catalog.packageName,
      catalog.name,
    );
    await createLockSettings(id, 'passcode', true, 5, true);
    await createSecurityEvent(
      userId,
      EVENT_TYPES.APP_LOCKED,
      catalog.packageName,
      `${catalog.name} locked`,
    );
  }
}

export async function listProtectedApps(
  userId: number,
): Promise<ProtectedApp[]> {
  return getProtectedAppsByUser(userId);
}

export async function lockApp(
  userId: number,
  packageName: string,
  appName: string,
): Promise<void> {
  const existing = await getProtectedAppByPackageName(userId, packageName);
  if (existing) {
    await updateProtectedApp(existing.id, appName, true);
  } else {
    const id = await createProtectedApp(userId, packageName, appName);
    await createLockSettings(id, 'passcode', true, 5, true);
  }

  await createSecurityEvent(
    userId,
    EVENT_TYPES.APP_LOCKED,
    packageName,
    `${appName} locked`,
  );
}

export async function unlockApp(
  userId: number,
  packageName: string,
): Promise<void> {
  const existing = await getProtectedAppByPackageName(userId, packageName);
  if (!existing) {
    return;
  }

  await updateProtectedApp(existing.id, existing.app_name, false);
  await createSecurityEvent(
    userId,
    EVENT_TYPES.APP_UNLOCKED,
    packageName,
    `${existing.app_name} unlocked`,
  );
}

export async function removeProtectedApp(
  userId: number,
  packageName: string,
): Promise<void> {
  const existing = await getProtectedAppByPackageName(userId, packageName);
  if (!existing) {
    return;
  }
  await deleteProtectedApp(existing.id);
}

export function unlockedCatalog(lockedNames: string[]) {
  return APP_CATALOG.filter(app => !lockedNames.includes(app.name));
}
