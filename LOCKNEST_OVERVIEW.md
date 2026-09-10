# LockNest

LockNest is a React Native security app for protecting private apps and managing temporary access modes.

## Main flow

1. **Onboarding** explains the app.
2. **Passcode setup** stores a 4-6 digit passcode in secure storage.
3. **Dashboard** shows security status, protected-app count, active modes, and recent events.

## Features

- **App Lock:** Search the app catalog and mark apps as locked or unlocked.
- **Stay Mode:** Keep selected everyday apps available while higher-risk apps remain protected.
- **Guest Mode:** Temporarily allow a limited app list while private content stays hidden. Sessions expire after four hours.
- **Security Events:** View events such as app locks, wrong passcodes, mode changes, and suspicious attempts.
- **Intruder Alert:** Displays a warning when an unauthorized unlock attempt is recorded.
- **Voice Assistant:** Handles commands such as enabling Stay Mode, enabling Guest Mode, locking an app, opening settings, and showing security events.
- **Settings and Profile:** Shows security preferences, profile information, and the dark security theme.

## How it works

- React Navigation controls the screen flow.
- SQLite stores users, protected apps, settings, sessions, security events, and authentication attempts.
- React Native Keychain stores the passcode and onboarding state securely.
- Default protected apps include WhatsApp, Facebook, Instagram, Gallery, and YouTube.

## Important note

The current project implements the security workflow and local app-state management. Actual device-level blocking of other Android apps requires additional Android native enforcement and permissions.

## Run

```sh
npm install
npm start
npm run android
```

The Android debug app needs Metro running. A standalone release APK can run without Metro.
