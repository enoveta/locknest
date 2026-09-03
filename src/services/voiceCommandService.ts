import {findCatalogAppFuzzy} from '../constants/apps';
import type {VoiceCommandResult} from '../types';
import {activateStayMode, deactivateStayMode} from './stayModeService';
import {activateGuestMode} from './guestModeService';
import {lockApp, listProtectedApps} from './appLockService';
import {isStayModeActive} from './stayModeService';
import {isGuestModeActive} from './guestModeService';

export const EXAMPLE_VOICE_COMMANDS = [
  {label: 'Put LockNest in Stay Mode.', action: 'stay_on'},
  {label: 'Enable Guest Mode.', action: 'guest_on'},
  {label: 'Lock WhatsApp.', action: 'lock_app'},
  {label: 'Show Security Events.', action: 'events'},
];

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function executeVoiceCommand(
  userId: number,
  raw: string,
): Promise<VoiceCommandResult> {
  const text = normalize(raw);

  if (!text) {
    return {ok: false, message: 'I did not catch that. Please try again.'};
  }

  if (
    (text.includes('stay') &&
      (text.includes('off') ||
        text.includes('deactivate') ||
        text.includes('disable') ||
        text.includes('stop') ||
        text.includes('turn off'))) ||
    text.includes('turn off stay')
  ) {
    await deactivateStayMode(userId);
    return {ok: true, message: 'Stay Mode is now inactive.', navigateTo: 'StayMode'};
  }

  if (text.includes('stay')) {
    await activateStayMode(userId);
    return {ok: true, message: 'Stay Mode is now active.', navigateTo: 'StayMode'};
  }

  if (text.includes('guest')) {
    await activateGuestMode(userId);
    return {
      ok: true,
      message: 'Guest Mode is now active.',
      navigateTo: 'GuestMode',
    };
  }

  if (text.includes('security event') || text.includes('show event')) {
    return {
      ok: true,
      message: 'Opening Security Events.',
      navigateTo: 'SecurityEvents',
    };
  }

  if (text.includes('setting')) {
    return {ok: true, message: 'Opening Settings.', navigateTo: 'Settings'};
  }

  if (
    text.includes('security status') ||
    text.includes('how secure') ||
    text.includes('my status')
  ) {
    const stay = await isStayModeActive(userId);
    const guest = await isGuestModeActive(userId);
    const apps = await listProtectedApps(userId);
    const locked = apps.filter(app => app.is_locked === 1).length;
    return {
      ok: true,
      message: `Everything is secure. ${locked} apps locked. Stay Mode ${
        stay ? 'active' : 'inactive'
      }. Guest Mode ${guest ? 'active' : 'inactive'}.`,
    };
  }

  if (text.includes('protected') || text.includes('locked app')) {
    return {
      ok: true,
      message: 'Showing protected applications.',
      navigateTo: 'AppLock',
    };
  }

  if (text.startsWith('lock ') || text.includes(' lock ')) {
    const app = findCatalogAppFuzzy(text);
    if (!app) {
      return {ok: false, message: 'I could not find that application.'};
    }
    await lockApp(userId, app.packageName, app.name);
    return {
      ok: true,
      message: `${app.name} is now locked.`,
      navigateTo: 'AppLock',
    };
  }

  return {ok: false, message: 'Command not recognized. Try an example below.'};
}
