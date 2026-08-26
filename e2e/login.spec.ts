import { expect, test } from '@playwright/test';

/**
 * Playwright の基本形（このファイルがそのまま「書き方」の見本）
 *
 * - test('説明', async ({ page }) => { ... }) が 1 ケース
 * - page: ブラウザのタブ。ここを操作していく
 * - locator（getByText / getByPlaceholder / getByRole など）で要素を指す
 * - expect(...).toXxx() で状態を検証。要素が出るまで自動で待つのがポイント
 *
 * 実行前提: `npm run web` で Expo web を起動しておく（http://localhost:8081）
 */

test.describe('ログイン画面', () => {
  // 各テストの前に毎回トップ（＝ログイン画面）を開く
  test.beforeEach(async ({ page }) => {
    await page.goto('/'); // baseURL は playwright.config.ts で設定済み
  });

  test('初期表示でタイトルと入力欄が見える', async ({ page }) => {
    // getByText: 画面上のテキストで要素を探す
    await expect(page.getByText('献立プラン')).toBeVisible();
    // getByPlaceholder: input の placeholder で探す
    await expect(page.getByPlaceholder('example@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('6文字以上')).toBeVisible();
  });

  test('未入力でログインするとバリデーションエラーが出る', async ({ page }) => {
    await page.getByText('ログイン').click();
    await expect(page.getByText('メールアドレスを入力してください')).toBeVisible();
    await expect(page.getByText('パスワードを入力してください')).toBeVisible();
  });

  test('正しく入力するとログインできる（モック認証）', async ({ page }) => {
    // fill: input に値を入れる
    await page.getByPlaceholder('example@email.com').fill('test@example.com');
    await page.getByPlaceholder('6文字以上').fill('password123');
    await page.getByText('ログイン').click();

    // ログイン後はログイン画面のタイトルが消える想定
    await expect(page.getByText('献立プラン')).toBeHidden();
  });
});
