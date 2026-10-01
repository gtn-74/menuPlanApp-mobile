import { z } from 'zod';
import { MenuItemSchema } from './domain';

/**
 * 献立の作成/編集の入力値（id/userId/familyGroupId/createdAt は保存側で付与）。
 * ドメインの MenuItemSchema から必要項目だけ pick（単一の真実源を再利用）。
 */
export const MenuDraftSchema = MenuItemSchema.pick({
  date: true,
  name: true,
  budget: true,
  ingredients: true,
  photos: true,
});
export type MenuDraft = z.infer<typeof MenuDraftSchema>;

/**
 * フォーム UI 用のバリデーション。
 * budget は TextInput の文字列を数値へ変換する。材料は画面側で改行/カンマ分割して配列化する。
 *
 * 予算は**任意**：献立は「まず名前だけ決めて、金額は後で」という使い方が普通なので、
 * 未入力（空文字/undefined）は「予算なし＝0」として扱う。
 * 入力された場合だけ数値・非負を検証する（"abc" や "-1" は従来どおりエラー）。
 *
 * `z.coerce.number()` は入力型が `unknown` で、string を出す側と `.pipe()` で繋ぐと
 * 型が合わない（zod v4）。そのため Number() で変換してから検証する形にしている。
 */
export const menuFormSchema = z.object({
  name: z.string().trim().min(1, '料理名を入力してください'),
  budget: z
    .string()
    .trim()
    .default('')
    // 数値でない入力は Number() が NaN を返すので、下の check で弾かれる
    .transform((value) => (value === '' ? 0 : Number(value)))
    .refine((value) => Number.isFinite(value), '予算は数値で入力してください')
    .refine((value) => value >= 0, '予算は0以上で入力してください'),
});
export type MenuFormValues = z.infer<typeof menuFormSchema>;
