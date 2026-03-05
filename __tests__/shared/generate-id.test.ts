import { generateArticleId } from '@/shared/lib/utils/generate-id';

describe('generateArticleId', () => {
  it('generates a deterministic ID from a URL', () => {
    const url = 'https://example.com/article/1';
    const id1 = generateArticleId(url);
    const id2 = generateArticleId(url);
    expect(id1).toBe(id2);
  });

  it('generates different IDs for different URLs', () => {
    const id1 = generateArticleId('https://example.com/article/1');
    const id2 = generateArticleId('https://example.com/article/2');
    expect(id1).not.toBe(id2);
  });

  it('returns a non-empty string', () => {
    const id = generateArticleId('https://example.com');
    expect(id.length).toBeGreaterThan(0);
    expect(typeof id).toBe('string');
  });
});
