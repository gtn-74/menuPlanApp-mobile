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
    coverage: {
      provider: 'v8',
      // json-summary は PR コメント用（davelosert/vitest-coverage-report-action）
      // lcov は Codecov 連携用、json-summary は PR コメント用
      reporter: ['text', 'json', 'json-summary', 'lcov'],
      reportOnFailure: true,
      // vitest が実際にカバーする「ロジック層」のみ計測（描画は jest-expo 側で別計測）
      include: [
        'src/features/**/*.ts',
        'src/utils/**/*.ts',
        'src/schemas/**/*.ts',
        'src/stores/**/*.ts',
      ],
      exclude: ['**/*.test.ts', '**/*.d.ts'],
    },
  },
});
