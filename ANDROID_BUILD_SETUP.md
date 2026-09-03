# LockNest Android Build Setup Guide

## Prerequisites

Before you can build LockNest for Android, you need:

1. **Java JDK 17+** — Required for Android development
2. **Android SDK** — Required for building Android apps  
3. **Android Emulator** (optional) — For testing without a physical device

## Easiest Installation: Android Studio

Android Studio includes everything you need in one installer.

### Steps:

1. **Download Android Studio**
   - Visit: https://developer.android.com/studio
   - Download for Windows

2. **Run the Installer**
   - Accept the license agreement
   - Choose "Standard" installation (recommended)

3. **Complete Setup Wizard**
   - Let it download and configure Java JDK
   - Let it download and configure Android SDK
   - Allow it to download an Android emulator (optional but recommended)

4. **Launch Android Studio** (at least once)
   - This ensures all SDK components are properly initialized

---

## Configure Environment Variables (Permanent)

Once Android Studio is installed:

### Windows PowerShell (Recommended):

```powershell
# Set JAVA_HOME
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Android\Android Studio\jre", "User")

# Set ANDROID_HOME
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:USERPROFILE\AppData\Local\Android\Sdk", "User")

# Refresh current terminal
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jre"
$env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
```

### Windows GUI (Alternative):

1. Open **Settings** → search "Environment Variables"
2. Click **"Edit the system environment variables"**
3. Click **"Environment Variables"** button
4. Under "User variables", click **"New"**

Add two new variables:

| Variable Name | Variable Value |
|---------------|----------------|
| `JAVA_HOME` | `C:\Program Files\Android\Android Studio\jre` |
| `ANDROID_HOME` | `C:\Users\<YourUsername>\AppData\Local\Android\Sdk` |

---

## Verify Installation

In PowerShell or Command Prompt:

```powershell
# Check Java
java -version

# Check Android SDK
dir $env:ANDROID_HOME\platforms
```

Both should return without errors.

---

## Build LockNest

Once environment is set up:

```powershell
# Navigate to project
cd C:\Users\user\Desktop\LockNest

# Build and run on emulator
npm run android

# OR just build APK
cd android
.\gradlew assembleDebug
```

---

## Start Android Emulator (if you installed it)

```powershell
# List available emulators
emulator -list-avds

# Start one (replace "Pixel_API_35" with your emulator name)
emulator -avd Pixel_API_35
```

Then run `npm run android` to install and launch LockNest on the emulator.

---

## Troubleshooting

### "JAVA_HOME is not set"
- Make sure you set JAVA_HOME environment variable (see above)
- Restart your terminal after setting it
- Verify: `echo $env:JAVA_HOME` should return the path

### "Android SDK not found"
- Make sure ANDROID_HOME is set correctly
- Verify the directory exists: `Test-Path $env:ANDROID_HOME`
- Run Android Studio's SDK Manager to install missing components

### Gradle build fails
- Try: `cd android && .\gradlew clean`
- Then: `.\gradlew assembleDebug`

### No emulator available
- Open Android Studio
- Go to Tools → Device Manager
- Create a new virtual device (Pixel 6, API 35 recommended)

---

## Next: Testing the App

Once the app builds and launches on the emulator:

1. **Tap "Get Started"** to go through onboarding
2. **Create a 4-6 digit passcode** when prompted
3. **Tap "Dashboard"** to see the main app
4. **Try these flows:**
   - App Lock: Lock/unlock Instagram, WhatsApp, etc.
   - Stay Mode: Enable/disable with allowed apps
   - Guest Mode: Enable/disable temporary access
   - Security Events: View event history
   - Voice: Tap microphone button and say a command

---

## Support

If you run into issues:
1. Check the "Troubleshooting" section above
2. Run `npm run test` to ensure TypeScript and Jest are working
3. Check that `node --version` returns v22.11.0 or higher

Good luck! 🚀
