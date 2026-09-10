let sessionFailedAttempts = 0;

export function getSessionFailedAttempts(): number {
  return sessionFailedAttempts;
}

export function recordSessionFailedAttempt(): number {
  sessionFailedAttempts += 1;
  return sessionFailedAttempts;
}

export function resetSessionFailedAttempts(): void {
  sessionFailedAttempts = 0;
}
