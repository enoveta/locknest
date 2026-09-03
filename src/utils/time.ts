export function nowIso(): string {
  return new Date().toISOString();
}

export function greetingForNow(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) {
    return 'Good Morning,';
  }
  if (hour < 17) {
    return 'Good Afternoon,';
  }
  return 'Good Evening,';
}

export function formatEventTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) {
    return 'Just now';
  }
  if (mins < 60) {
    return `${mins} min ago`;
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return `${hours} hr ago`;
  }
  if (hours < 48) {
    return 'Yesterday';
  }
  return date.toLocaleDateString();
}

export function formatClock(date = new Date()): string {
  return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}
