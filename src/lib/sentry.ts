import * as Sentry from '@sentry/react-native';

// DSN は env から注入（クライアント埋め込み可だが env 管理）。未設定なら無効化。
const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

/**
 * Sentry を初期化する。DSN 未設定時は enabled:false で無効化し、
 * 開発・CI・DSN 未配布の環境でもアプリは通常どおり動作する。
 */
export function initSentry() {
  Sentry.init({
    dsn,
    enabled: Boolean(dsn),
    // 開発中は全トレース。プロダクションでは下げる（例: 0.2）。
    tracesSampleRate: 1.0,
    sendDefaultPii: false,
  });
}

export { Sentry };
