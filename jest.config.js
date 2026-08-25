/**
 * jest-expo: Expo/React Native 公式のテストプリセット。
 * RN コンポーネントを RNTL で描画・操作するのはこちらが担当。
 * （純ロジックは vitest / `*.test.ts` が担当し、住み分ける）
 *
 * @type {import('jest').Config}
 */
module.exports = {
  preset: 'jest-expo',
  // コンポーネントの描画テストは .test.tsx に限定（.test.ts は vitest）
  testMatch: ['**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
