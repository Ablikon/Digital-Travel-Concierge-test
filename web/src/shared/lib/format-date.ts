import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export function formatArticleDate(dateString: string): string {
  const date = parseISO(dateString);
  if (!isValid(date)) return 'Unknown date';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return format(date, 'MMM d, yyyy');
}

export function formatFullDate(dateString: string): string {
  const date = parseISO(dateString);
  if (!isValid(date)) return 'Unknown date';
  return format(date, 'MMMM d, yyyy \'at\' h:mm a');
}
