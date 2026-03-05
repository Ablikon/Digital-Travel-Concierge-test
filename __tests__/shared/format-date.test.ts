import { formatDate, formatRelativeDate, toISODateString } from '@/shared/lib/utils/format-date';

describe('formatDate', () => {
  it('formats a valid ISO date string', () => {
    const result = formatDate('2026-03-05T10:30:00Z');
    expect(result).toBe('Mar 5, 2026');
  });

  it('returns "Unknown date" for invalid input', () => {
    expect(formatDate('invalid')).toBe('Unknown date');
    expect(formatDate('')).toBe('Unknown date');
  });

  it('handles different months correctly', () => {
    expect(formatDate('2026-01-15T00:00:00Z')).toBe('Jan 15, 2026');
    expect(formatDate('2026-12-25T00:00:00Z')).toBe('Dec 25, 2026');
  });
});

describe('formatRelativeDate', () => {
  it('returns "Unknown" for invalid dates', () => {
    expect(formatRelativeDate('invalid')).toBe('Unknown');
  });

  it('returns "Just now" for very recent dates', () => {
    const now = new Date().toISOString();
    expect(formatRelativeDate(now)).toBe('Just now');
  });

  it('returns minutes ago for recent dates', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60000).toISOString();
    expect(formatRelativeDate(fiveMinutesAgo)).toBe('5m ago');
  });

  it('returns hours ago for dates within a day', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600000).toISOString();
    expect(formatRelativeDate(threeHoursAgo)).toBe('3h ago');
  });

  it('returns days ago for dates within a week', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString();
    expect(formatRelativeDate(twoDaysAgo)).toBe('2d ago');
  });
});

describe('toISODateString', () => {
  it('converts a Date to ISO date string', () => {
    const date = new Date('2026-03-05T10:30:00Z');
    expect(toISODateString(date)).toBe('2026-03-05');
  });
});
