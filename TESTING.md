# テスト

このプロジェクトでは 2 種類のテストを使う。

| 種類 | ツール | 対象 | 置き場所 |
| --- | --- | --- | --- |
| 単体テスト | [Vitest](https://vitest.dev/) | 純粋なロジック（関数・store など） | `src/**/*.test.ts` |
| E2E テスト | [Playwright](https://playwright.dev/) | ブラウザ上の画面操作（Expo web） | `e2e/**/*.spec.ts` |

## Vitest（単体テスト）

ロジックの入出力を検証する。React Native コンポーネントは描画しない（`environment: 'node'`）。

```bash
npm test          # 1 回実行
npm run test:watch  # 変更を監視して再実行
```

書き方の例:

```ts
import { describe, it, expect } from 'vitest';
import { getUserName } from '@/mocks/data';

describe('getUserName', () => {
  it('存在するIDは名前を返す', () => {
    expect(getUserName('user-1')).toBe('パパ');
  });
  it('存在しないIDは「不明」を返す', () => {
    expect(getUserName('unknown')).toBe('不明');
  });
});
```

> **設計のヒント**: 「テストが書きにくい＝設計を見直すサイン」。
> 例えば画面(`CalendarView`)の中に直接書かれた計算ロジックは、
> コンポーネントを描画しないと検証できず単体テストしづらい。
> こういうロジックは**純粋関数として切り出す**とそのまま Vitest でテストできる。

## Playwright（E2E テスト）

実際のブラウザで Expo web ビルドを開き、ユーザー操作を再現して検証する。
（ネイティブの実機/シミュレータは操作できない点に注意）

初回だけブラウザ本体を取得:

```bash
npx playwright install chromium
```

実行:

```bash
npm run web        # 別ターミナルで Expo web を起動（http://localhost:8081）
npm run test:e2e   # e2e/ のテストを実行
```

書き方は `e2e/login.spec.ts` を参照（コメント付きの見本）。基本形:

```ts
import { test, expect } from '@playwright/test';

test('タイトルが見える', async ({ page }) => {
  await page.goto('/');                       // baseURL は playwright.config.ts
  await expect(page.getByText('献立プラン')).toBeVisible();
});
```

デバッグに便利:

```bash
npx playwright test --ui     # UI モードで 1 ステップずつ確認
npx playwright show-trace    # 失敗時のトレースを開く
```
