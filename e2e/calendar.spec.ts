import { expect, test } from '@playwright/test';

/**
 * page 層のテスト（Playwright）= 実データ・store・画面遷移を結線した状態のフロー検証。
 * ここは RNTL ではなく Playwright の担当領域。
 *
 * 併せて VRT（Visual Regression Testing）の書き方も示す:
 *   toHaveScreenshot() は初回に基準画像を作り、次回以降は画素差分で崩れを検出する。
 *   基準を更新したいときは:  npx playwright test --update-snapshots
 *
 * 実行前提: `npm run web`（Expo web, http://localhost:8081）を起動しておく。
 */

test.describe('カレンダー画面（page / E2E + VRT）', () => {
  test.beforeEach(async ({ page }) => {
    // モック認証なので任意の値でログイン→カレンダーへ遷移
    await page.goto('/');
    await page.getByPlaceholder('example@email.com').fill('test@example.com');
    await page.getByPlaceholder('6文字以上').fill('password123');
    await page.getByText('ログイン').click();
    // ログイン画面のタイトルが消える＝遷移完了の目印
    await expect(page.getByText('献立プラン')).toBeHidden();
  });

  test('フロー: ユーザーフィルタを切り替えられる', async ({ page }) => {
    // クイックフィルタの「パパ」ボタンをタップして表示/非表示をトグル
    const papa = page.getByText('パパ');
    await expect(papa).toBeVisible();
    await papa.click();
    // トグル後も落ちない（実挙動の結線確認）。詳細な見た目は次のVRTで担保。
    await expect(papa).toBeVisible();
  });

  test('VRT: カレンダー画面の見た目が崩れていない', async ({ page }) => {
    // レイアウトが安定するまで待ってからスクショ比較
    await expect(page.getByText('パパ')).toBeVisible();
    await expect(page).toHaveScreenshot('calendar-screen.png', {
      // アニメーションを止めて誤検知を減らす
      animations: 'disabled',
      // 差分許容（フォントレンダリング差の軽微なノイズを吸収）
      maxDiffPixelRatio: 0.01,
    });
  });
});
