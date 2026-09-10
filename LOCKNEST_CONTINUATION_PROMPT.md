# LockNest Development Continuation Prompt

Use this document as the handoff prompt for another AI developer.

## Project and purpose

LockNest is a React Native Android security app. Its final purpose is to let a phone owner:

- Create and protect a 4-6 digit passcode.
- See launchable apps installed on the phone.
- Select apps to lock.
- Show a passcode screen when a locked app is opened.
- Use Guest Mode to temporarily allow a selected set of apps, with a time limit.
- Let the owner choose the Guest Mode duration before activation.
- Use Stay Mode to keep selected everyday apps available while other protected apps remain restricted.
- Record security events such as wrong passcodes, lock changes, and mode changes.
- Provide a clear, reliable, privacy-focused security dashboard.

The final product must work on a real Android phone, not only in the React Native UI. Android permissions and user-controlled accessibility settings must be explained clearly.

## Repository

- Project: `C:\Users\user\Desktop\LockNest`
- Android project: `C:\Users\user\Desktop\LockNest\android`
- Main source: `C:\Users\user\Desktop\LockNest\src`
- APK output: `C:\Users\user\Desktop\LockNest\android\app\build\outputs\apk\debug\app-debug.apk`

## Work completed

### React Native application

- Onboarding, passcode creation, dashboard, app lock, Guest Mode, Stay Mode, settings, profile, voice assistant, security events, and intruder screens exist.
- Passcodes are stored through the existing secure-storage/auth service.
- SQLite is used for local app state, protected apps, sessions, and security events.
- App Lock, Guest Mode, and Stay Mode screens were updated to use native installed-app discovery instead of only the hard-coded catalog.
- The app seeds the existing catalog and synchronizes selected locked package names to Android.
- Guest Mode and Stay Mode selections are synchronized to the Android accessibility policy.
- Guest Mode expires automatically; the current implementation uses a four-hour default.
- Failed unlock attempts are recorded and an intruder alert is raised after three failures.
- A previous Android `StatusBar` runtime crash was removed from `App.tsx`.

### Native Android integration

The following files were added:

- `android/app/src/main/java/com/locknest/InstalledAppsModule.kt`
- `android/app/src/main/java/com/locknest/InstalledAppsPackage.kt`
- `android/app/src/main/java/com/locknest/AppLockAccessibilityService.kt`
- `android/app/src/main/res/xml/app_lock_accessibility_service.xml`
- `src/services/installedAppsService.ts`

The native module currently intends to:

- Enumerate launchable apps with `PackageManager`.
- Receive the locked package list from React Native.
- Open Android Accessibility settings.
- Store and retrieve the package currently waiting for unlock.

The accessibility service currently intends to:

- Watch window-change events.
- Detect a selected locked package.
- Save the pending package name.
- Bring `MainActivity` to the foreground so React Native can show the unlock passcode screen.

### Build

- A debug APK was built successfully at the APK path above.
- Java 17 and Gradle 8.14.3 were used.
- The build was tested for `arm64-v8a`; use the correct architecture or universal configuration when needed.
- A LAN server was previously used at `http://10.110.10.119:8000/app-debug.apk`, but this is temporary and may not be running.

## Important limitations and unfinished work

Do not describe the feature as fully finished until these items are verified on a physical phone:

1. Install the latest APK on the phone and confirm it launches without a Metro dependency.
2. Enable LockNest under Android Settings > Accessibility.
3. Select a real installed app and confirm it is synchronized to the native service.
4. Open the locked app and confirm the LockNest unlock screen appears every time.
5. Enter the correct passcode and confirm the intended app-access flow.
6. Enter wrong passcodes and confirm the user remains blocked; do not silently return to an unsafe state.
7. Confirm that the pending package is cleared only after successful unlock.
8. Confirm Guest Mode's selected-app behavior and configurable duration.
9. Confirm Stay Mode's selected-app behavior.
10. Confirm behavior after reboot, LockNest process restart, and accessibility-service restart.
11. Confirm that the service does not repeatedly launch LockNest or create a loop.
12. Add or repair tests/type checks for the native bridge and passcode flow where the repository's existing test setup allows it.
13. Add a Guest Mode duration selector and persist the selected duration instead of relying on the four-hour default.
14. Implement automatic intruder photo capture after a configurable number of failed attempts, with explicit camera permission, private storage, cleanup, and evidence records.

### Known design constraints

- Android does not allow the app to enable its own accessibility service silently. The user must enable it manually.
- `PackageManager` discovery returns launchable apps, not every installed package or background service.
- Accessibility interception is not the same as a privileged OS-level blocker. It can be affected by Android version, OEM behavior, service settings, or the user disabling the service.
- The current wrong-passcode fallback and return-to-blocked-app behavior still needs real-device validation and likely refinement.
- Automatic intruder photo capture is not implemented. It must not claim to work until Android camera permission, foreground/background restrictions, private storage, and real-device behavior are verified.
- The APK download server is local to the development computer. A phone must use the same network for a LAN link. USB installation should use ADB instead.

## USB installation and testing

On the development computer:

```powershell
adb devices
adb install -r "C:\Users\user\Desktop\LockNest\android\app\build\outputs\apk\debug\app-debug.apk"
adb reverse tcp:8081 tcp:8081
```

If `adb devices` shows `unauthorized`, unlock the phone and accept the USB debugging dialog. If no device appears, enable Developer options and USB debugging, reconnect the cable, and choose File Transfer if required.

For a debug build that needs Metro:

```powershell
cd "C:\Users\user\Desktop\LockNest"
npm start
```

For a standalone APK, first verify whether the current APK contains the JavaScript bundle. If it shows “Unable to load script”, start Metro and keep the USB reverse connection active, or produce a properly bundled release APK.

## Recommended next implementation order

1. Inspect the current native bridge and TypeScript bridge for syntax, registration, and promise errors.
2. Build again from a clean state and record the exact APK timestamp.
3. Install with ADB over USB.
4. Test onboarding and passcode creation.
5. Enable accessibility and test one locked app.
6. Fix incorrect-passcode and successful-unlock navigation behavior.
7. Test Guest Mode duration selection, expiry, and package synchronization; test Stay Mode package synchronization.
8. Test service restart/reboot behavior.
9. Implement and test configurable intruder-photo capture after the chosen failed-attempt threshold.
10. Add user-facing error messages for missing accessibility/camera permission and unavailable installed-app data.
11. Build a release APK with an embedded JavaScript bundle and provide a verified installation method.

## Acceptance criteria

The work is complete only when a physical Android phone can:

- Install and open LockNest.
- Create a passcode.
- Display real launchable installed apps.
- Lock a selected app.
- Require the passcode when that app is opened.
- Reject an incorrect passcode without allowing access.
- Allow the correct passcode through the intended flow.
- Apply and expire Guest Mode correctly.
- Respect the owner-selected Guest Mode duration.
- Apply Stay Mode correctly.
- Capture and securely store an intruder photo after the configured failed-attempt threshold, when permission and Android restrictions allow it.
- Recover safely after app/service restart.

When changing code, preserve the existing dark security theme, navigation, local persistence, and user data. Make small, type-safe changes, run the repository's existing validation commands, and never claim device-level enforcement is verified without testing it on a real Android device.
