// AsyncStorage を使うコンポーネント/ストアを描画してもテストが落ちないように公式モックを注入
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
