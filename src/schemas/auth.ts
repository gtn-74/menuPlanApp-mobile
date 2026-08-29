import { z } from 'zod';

/**
 * 認証フォームの入力スキーマ（ユーザー入力＝外部データの検証）。
 * 手書きの validate を置き換える。エラーメッセージは日本語で定義。
 */

// 空欄は min(1) で専用メッセージ、形式は zod 組み込みの z.email で検証（自前 regex 不要）
const email = z
  .string()
  .trim()
  .min(1, 'メールアドレスを入力してください')
  .pipe(z.email('正しいメールアドレスを入力してください'));

const password = z
  .string()
  .min(1, 'パスワードを入力してください')
  .min(6, 'パスワードは6文字以上で入力してください');

export const loginFormSchema = z.object({ email, password });

export const signUpFormSchema = z
  .object({
    name: z.string().trim().min(1, '表示名を入力してください'),
    email,
    password,
    confirmPassword: z.string().min(1, 'パスワード確認を入力してください'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'パスワードが一致しません',
  });

export type LoginForm = z.infer<typeof loginFormSchema>;
export type SignUpForm = z.infer<typeof signUpFormSchema>;

/**
 * zod のエラーを「フィールド名 → 最初のメッセージ」の辞書へ変換する。
 * （同一フィールドに複数の指摘があっても、先頭＝最も入口側のメッセージを採用）
 */
export function firstFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && out[key] === undefined) {
      out[key] = issue.message;
    }
  }
  return out;
}
