import { defineConfig, devices } from '@playwright/test';

/**
 * Storybook のストーリーに対する VRT 専用の Playwright 設定。
 * 各ストーリーの iframe をブラウザで開き、`toHaveScreenshot()` で画素比較する。
 *
 * 実行: npm run test:vrt         （基準と比較）
 * 更新: npm run test:vrt -- --update-snapshots
 *
 * webServer が Storybook を自動起動するので、手動起動は不要。
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: /storybook\.spec\.ts/,
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:6007',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // dev サーバ(rolldown)は一部RNモジュールで不安定なため、
  // 決定的な静的ビルド(build-storybook)を配信して VRT する。
  webServer: {
    command: 'npm run build-storybook && python3 -m http.server 6007 --directory storybook-static',
    url: 'http://localhost:6007',
    reuseExistingServer: true,
    timeout: 240_000,
  },
});
