import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright は「ブラウザ」を自動操作する E2E テスト用ツール。
 * このアプリはネイティブ(iOS/Android)だが、Expo の web ビルド
 * (react-native-web) をブラウザで開いて画面操作を検証できる。
 *
 * 事前準備（初回のみ、ブラウザ本体のダウンロード）:
 *   npx playwright install chromium
 *
 * 実行:
 *   npm run web        # 別ターミナルで Expo web を起動（http://localhost:8081）
 *   npm run test:e2e   # e2e/ 以下の *.spec.ts を実行
 */
export default defineConfig({
  testDir: './e2e',
  // 各テストを独立させる（順序に依存しない）
  fullyParallel: true,
  // 共通設定
  use: {
    baseURL: 'http://localhost:8081',
    // 失敗時のみトレースを残す（`npx playwright show-trace` で確認可能）
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // 下を有効にすると test:e2e 実行時に自動で Expo web を起動する。
  // （CI などで手動起動を省きたい場合に使う）
  // webServer: {
  //   command: 'npm run web',
  //   url: 'http://localhost:8081',
  //   reuseExistingServer: true,
  //   timeout: 120_000,
  // },
});
