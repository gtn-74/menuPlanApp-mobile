import { describe, expect, it } from 'vitest';
import { MenuDraftSchema, menuFormSchema } from './menu';

describe('menuFormSchema', () => {
  it('正しい入力は通る（budget は文字列でも coerce）', () => {
    const r = menuFormSchema.safeParse({ name: 'カレー', budget: '800' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.budget).toBe(800);
  });

  it('料理名が空はエラー', () => {
    const r = menuFormSchema.safeParse({ name: '  ', budget: '0' });
    expect(r.success).toBe(false);
  });

  it('budget が数値でなければエラー', () => {
    expect(menuFormSchema.safeParse({ name: 'A', budget: 'abc' }).success).toBe(false);
  });

  it('budget が負ならエラー', () => {
    expect(menuFormSchema.safeParse({ name: 'A', budget: '-1' }).success).toBe(false);
  });
});

describe('MenuDraftSchema', () => {
  it('date は YYYY-MM-DD を検証（ドメインschema由来）', () => {
    const base = { date: '2026-01-10', name: 'A', budget: 100, ingredients: [], photos: [] };
    expect(MenuDraftSchema.safeParse(base).success).toBe(true);
    expect(MenuDraftSchema.safeParse({ ...base, date: '2026/01/10' }).success).toBe(false);
  });
});
