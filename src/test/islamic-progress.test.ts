import { describe, expect, it } from 'vitest';
import { QURAN_SURAHS } from '@/data/islamicLearningData';
import { validateProgress, summarizeProgress, type QuranProgress } from '@/lib/islamicProgress';

describe('Quran progress', () => {
  it('contains all 114 Surahs and 6236 verses', () => {
    expect(QURAN_SURAHS.map(s => s.number)).toEqual(Array.from({ length: 114 }, (_, i) => i + 1));
    expect(QURAN_SURAHS.reduce((n, s) => n + s.verses, 0)).toBe(6236);
    expect(QURAN_SURAHS[0].verses).toBe(7);
    expect(QURAN_SURAHS[113].verses).toBe(6);
  });
  it('rejects verse counts beyond the selected Surah', () => {
    expect(validateProgress(112, 5, 'in_progress')).not.toBeNull();
    expect(validateProgress(112, 4, 'memorized')).toBeNull();
    expect(validateProgress(112, 3, 'memorized')).not.toBeNull();
  });
  it('flags revision after seven days and never-reviewed learning', () => {
    const rows = [{ verses_memorized: 4, total_verses: 4, last_reviewed: '2026-10-12' }, { verses_memorized: 1, total_verses: 7, last_reviewed: null }, { verses_memorized: 3, total_verses: 6, last_reviewed: '2026-10-18' }] as QuranProgress[];
    expect(summarizeProgress(rows, [], new Date('2026-10-19T00:00:00')).revisionDue).toBe(2);
    expect(summarizeProgress(rows, []).verses).toBe(8);
  });
});