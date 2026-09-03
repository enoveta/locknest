#!/usr/bin/env pwsh
# LockNest Android Build Setup
# Run this AFTER installing Android Studio

# 1. Find Android Studio Installation Path
$androidStudioPath = "C:\Program Files\Android\Android Studio"  # Default path
Write-Host "Android Studio Path: $androidStudioPath"

# 2. Set up environment variables for this session
# (You can also set these permanently in System Properties > Environment Variables)

# Find Java JDK that came with Android Studio
$javaHome = "$androidStudioPath\jre"
if (-not (Test-Path $javaHome)) {
    # Fallback: check for system Java installation
    $javaHome = "C:\Program Files\Java\jdk-17"  # Adjust version as needed
}

$androidHome = "$env:USERPROFILE\AppData\Local\Android\Sdk"

Write-Host ""
Write-Host "Setting up environment variables..."
Write-Host "JAVA_HOME: $javaHome"
Write-Host "ANDROID_HOME: $androidHome"

# Export for current session
$env:JAVA_HOME = $javaHome
$env:ANDROID_HOME = $androidHome
$env:PATH = "$javaHome\bin;$androidHome\platform-tools;$androidHome\tools;$env:PATH"

Write-Host ""
Write-Host "Environment variables configured!"
Write-Host ""

# 3. Verify installations
Write-Host "Verifying Java..."
if (Test-Path "$javaHome\bin\java.exe") {
    & "$javaHome\bin\java.exe" -version
} else {
    Write-Host "WARNING: Java not found at $javaHome"
}

Write-Host ""
Write-Host "Verifying Android SDK..."
if (Test-Path $androidHome) {
    Write-Host "Android SDK found at: $androidHome"
    Get-ChildItem "$androidHome\platforms" -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "WARNING: Android SDK not found at $androidHome"
}

Write-Host ""
Write-Host "Setup complete! You can now build LockNest."
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. cd C:\Users\user\Desktop\LockNest"
Write-Host "  2. npm run android    (to build and run on emulator)"
Write-Host ""
