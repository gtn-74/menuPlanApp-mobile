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
 * budget は TextInput の文字列を数値へ coerce。材料は画面側で改行/カンマ分割して配列化する。
 */
export const menuFormSchema = z.object({
  name: z.string().trim().min(1, '料理名を入力してください'),
  budget: z.coerce
    .number({ message: '予算は数値で入力してください' })
    .min(0, '予算は0以上で入力してください'),
});
export type MenuFormValues = z.infer<typeof menuFormSchema>;
