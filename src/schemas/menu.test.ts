import { describe, expect, it } from 'vitest';
import { MenuDraftSchema, menuFormSchema, menuQuickAddSchema, quickAddToDraft } from './menu';

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

  it('budget 未入力（空文字）は 0 として通る', () => {
    const r = menuFormSchema.safeParse({ name: 'A', budget: '' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.budget).toBe(0);
  });

  it('budget 未指定（undefined）も 0 として通る', () => {
    const r = menuFormSchema.safeParse({ name: 'A' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.budget).toBe(0);
  });

  it('budget が空白だけでも 0 として通る', () => {
    const r = menuFormSchema.safeParse({ name: 'A', budget: '   ' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.budget).toBe(0);
  });

  it('エラーは budget フィールドに紐づく（firstFieldErrors で拾える path）', () => {
    const r = menuFormSchema.safeParse({ name: 'A', budget: 'abc' });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]?.path).toEqual(['budget']);
  });
});

describe('menuQuickAddSchema', () => {
  it('料理名だけで通る', () => {
    const r = menuQuickAddSchema.safeParse({ name: 'カレー' });
    expect(r.success).toBe(true);
  });

  it('前後の空白は落ちる', () => {
    const r = menuQuickAddSchema.safeParse({ name: '  カレー  ' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.name).toBe('カレー');
  });

  it('空文字・空白のみはエラー', () => {
    expect(menuQuickAddSchema.safeParse({ name: '' }).success).toBe(false);
    expect(menuQuickAddSchema.safeParse({ name: '   ' }).success).toBe(false);
  });
});

describe('quickAddToDraft', () => {
  it('MenuDraft として保存できる形になる', () => {
    const draft = quickAddToDraft('2026-01-10', 'カレー');
    expect(MenuDraftSchema.safeParse(draft).success).toBe(true);
    expect(draft).toEqual({
      date: '2026-01-10',
      name: 'カレー',
      budget: 0,
      ingredients: [],
      photos: [],
    });
  });
});

describe('MenuDraftSchema', () => {
  it('date は YYYY-MM-DD を検証（ドメインschema由来）', () => {
    const base = { date: '2026-01-10', name: 'A', budget: 100, ingredients: [], photos: [] };
    expect(MenuDraftSchema.safeParse(base).success).toBe(true);
    expect(MenuDraftSchema.safeParse({ ...base, date: '2026/01/10' }).success).toBe(false);
  });
});
