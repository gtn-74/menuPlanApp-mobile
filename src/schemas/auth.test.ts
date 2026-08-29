import { describe, expect, it } from 'vitest';
import { firstFieldErrors, loginFormSchema, signUpFormSchema } from './auth';

/** safeParse して firstFieldErrors 化する小ヘルパ */
const errorsOf = (schema: typeof loginFormSchema | typeof signUpFormSchema, input: unknown) => {
  const r = schema.safeParse(input);
  return r.success ? {} : firstFieldErrors(r.error);
};

describe('loginFormSchema', () => {
  it('正しい入力は通る', () => {
    expect(loginFormSchema.safeParse({ email: 'a@example.com', password: 'secret6' }).success).toBe(
      true,
    );
  });

  it('空メールは「入力してください」（正しい形式より優先）', () => {
    expect(errorsOf(loginFormSchema, { email: '', password: 'secret6' }).email).toBe(
      'メールアドレスを入力してください',
    );
  });

  it('不正メールは「正しいメールアドレス」', () => {
    expect(errorsOf(loginFormSchema, { email: 'bad', password: 'secret6' }).email).toBe(
      '正しいメールアドレスを入力してください',
    );
  });

  it('短いパスワードは「6文字以上」', () => {
    expect(errorsOf(loginFormSchema, { email: 'a@example.com', password: '123' }).password).toBe(
      'パスワードは6文字以上で入力してください',
    );
  });
});

describe('signUpFormSchema', () => {
  const valid = {
    name: '太郎',
    email: 'a@example.com',
    password: 'secret6',
    confirmPassword: 'secret6',
  };

  it('正しい入力は通る', () => {
    expect(signUpFormSchema.safeParse(valid).success).toBe(true);
  });

  it('パスワード不一致は confirmPassword にエラー', () => {
    expect(
      errorsOf(signUpFormSchema, { ...valid, confirmPassword: 'other6' }).confirmPassword,
    ).toBe('パスワードが一致しません');
  });

  it('表示名が空ならエラー', () => {
    expect(errorsOf(signUpFormSchema, { ...valid, name: '  ' }).name).toBe(
      '表示名を入力してください',
    );
  });
});
