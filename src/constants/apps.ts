export type CatalogApp = {
  name: string;
  emoji: string;
  packageName: string;
};

export const APP_CATALOG: CatalogApp[] = [
  {name: 'WhatsApp', emoji: '💬', packageName: 'com.whatsapp'},
  {name: 'Facebook', emoji: '📘', packageName: 'com.facebook.katana'},
  {name: 'Instagram', emoji: '📸', packageName: 'com.instagram.android'},
  {name: 'Gallery', emoji: '🖼️', packageName: 'com.google.android.apps.photos'},
  {name: 'Messages', emoji: '💬', packageName: 'com.google.android.apps.messaging'},
  {name: 'Chrome', emoji: '🌐', packageName: 'com.android.chrome'},
  {name: 'YouTube', emoji: '▶️', packageName: 'com.google.android.youtube'},
  {name: 'Gmail', emoji: '📧', packageName: 'com.google.android.gm'},
  {name: 'Twitter', emoji: '🐦', packageName: 'com.twitter.android'},
  {name: 'Snapchat', emoji: '👻', packageName: 'com.snapchat.android'},
  {name: 'TikTok', emoji: '🎵', packageName: 'com.zhiliaoapp.musically'},
  {name: 'Spotify', emoji: '🎧', packageName: 'com.spotify.music'},
  {name: 'Telegram', emoji: '✈️', packageName: 'org.telegram.messenger'},
  {name: 'Photos', emoji: '📷', packageName: 'com.google.android.apps.photos.pixel'},
  {name: 'Phone', emoji: '📞', packageName: 'com.google.android.dialer'},
];

export const DEFAULT_LOCKED_APPS = [
  'WhatsApp',
  'Facebook',
  'Instagram',
  'Gallery',
  'YouTube',
];

export const DEFAULT_STAY_ALLOWED = [
  'Phone',
  'Messages',
  'WhatsApp',
  'Gallery',
];

export const STAY_MODE_PACKAGE = 'com.locknest.global';

export function findCatalogApp(nameOrPackage: string): CatalogApp | undefined {
  const needle = nameOrPackage.toLowerCase();
  return APP_CATALOG.find(
    app =>
      app.name.toLowerCase() === needle ||
      app.packageName.toLowerCase() === needle,
  );
}

export function findCatalogAppFuzzy(query: string): CatalogApp | undefined {
  const needle = query.toLowerCase();
  return APP_CATALOG.find(app => needle.includes(app.name.toLowerCase()));
}
