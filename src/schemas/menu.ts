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

/** 料理名の共通ルール。詳細フォームとクイック追加で同じ検証を使う。 */
const menuName = z.string().trim().min(1, '料理名を入力してください');

/**
 * フォーム UI 用のバリデーション。
 * budget は TextInput の文字列を数値へ coerce。材料は画面側で改行/カンマ分割して配列化する。
 *
 * 予算は**任意**：週別ビューから料理名だけで素早く登録できるようにするため、
 * 未入力（空文字/undefined）は「予算なし＝0」として扱う。
 * 入力された場合だけ数値・非負を検証する（"abc" や "-1" は従来どおりエラー）。
 */
export const menuFormSchema = z.object({
  name: menuName,
  budget: z
    .string()
    .trim()
    .default('')
    .transform((value) => (value === '' ? '0' : value))
    .pipe(
      z.coerce
        .number({ message: '予算は数値で入力してください' })
        .min(0, '予算は0以上で入力してください'),
    ),
});
export type MenuFormValues = z.infer<typeof menuFormSchema>;

/**
 * 週別/日別ビューのインライン入力用。料理名だけで1件成立させる。
 * 予算・材料・写真は後から詳細フォーム（MenuAddScreen）で足す前提。
 */
export const menuQuickAddSchema = z.object({ name: menuName });
export type MenuQuickAddValues = z.infer<typeof menuQuickAddSchema>;

/** クイック追加の入力値を、そのまま保存できる MenuDraft へ広げる。 */
export function quickAddToDraft(date: string, name: string): MenuDraft {
  return { date, name, budget: 0, ingredients: [], photos: [] };
}
