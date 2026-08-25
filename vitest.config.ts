import { defineConfig } from 'vitest/config';

// `@/` エイリアスを src へ解決（node types 非依存で URL から算出）
const srcDir = new URL('./src', import.meta.url).pathname;

export default defineConfig({
  resolve: {
    alias: {
      '@': srcDir,
    },
  },
  test: {
    // 純ロジックの単体テストが対象。RN コンポーネントは描画しない。
    // 描画テスト(*.test.tsx)は jest-expo + RNTL に任せるため .ts のみ対象にする。
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
});
