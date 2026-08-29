import { expect, test } from '@playwright/test';

/**
 * Storybook のストーリー単位の VRT（見た目の回帰テスト）。
 * 各ストーリーの iframe を開き、#storybook-root を画素比較する。
 * 専用設定 playwright.storybook.config.ts（webServer が Storybook を起動）で実行する。
 *
 * story id = title(kebab) + '--' + export名(kebab)
 *   例) title:'atoms/Dot' + export Default -> 'atoms-dot--default'
 */
const STORY_IDS = [
  'atoms-dot--default',
  'atoms-dot--large',
  'molecules-userfilterbutton--visible',
  'molecules-userfilterbutton--inactive',
  'templates-calendarlayout--basic',
  'organisms-header--all',
  'organisms-header--budget',
  'organisms-calendarview--default',
  'organisms-calendarview--empty',
];

for (const id of STORY_IDS) {
  test(`VRT: ${id}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    const root = page.locator('#storybook-root');
    await expect(root).toBeVisible();
    // フォント/レイアウトの安定待ち（誤検知低減）
    await page.waitForTimeout(300);
    await expect(root).toHaveScreenshot(`${id}.png`, {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });
}
