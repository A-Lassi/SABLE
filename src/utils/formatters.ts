export function formatSalary(min: number | null, max: number | null, currency = 'USD', period = 'yearly'): string {
  const fmt = (n: number) => {
    if (period === 'yearly' && n >= 1000) {
      return `${currency === 'USD' ? '$' : currency}${Math.round(n / 1000)}k`;
    }
    return `${currency === 'USD' ? '$' : currency}${n.toLocaleString()}`;
  };

  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  if (max) return `Up to ${fmt(max)}`;
  return 'Salary not listed';
}

export function formatLocation(city: string, state: string, isRemote: boolean): string {
  const loc = [city, state].filter(Boolean).join(', ');
  if (isRemote && loc) return `${loc} (Remote)`;
  if (isRemote) return 'Remote';
  return loc || 'Location not specified';
}

export function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return date.toLocaleDateString();
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}
