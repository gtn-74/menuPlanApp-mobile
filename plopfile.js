/**
 * Plop: Atomic Design のコンポーネント雛形を CLI 生成する。
 *   pnpm run gen:component            # 対話（層と名前を入力）
 *   pnpm run gen:component atoms Foo  # バイパス（層 名前 の順）
 *
 * 1コマンドで 4ファイル（component / styles / test / stories）を規約どおり出力する。
 */
module.exports = function (plop) {
  plop.setGenerator('component', {
    description: 'Atomic Design のコンポーネント雛形 (tsx/styles/test/stories)',
    prompts: [
      {
        type: 'list',
        name: 'layer',
        message: '層を選択',
        choices: ['atoms', 'molecules', 'organisms', 'templates'],
      },
      {
        type: 'input',
        name: 'name',
        message: 'コンポーネント名 (PascalCase 推奨)',
        validate: (v) => (v && v.trim().length > 0 ? true : '名前を入力してください'),
      },
    ],
    actions: () => {
      const base = 'src/components/{{layer}}/{{pascalCase name}}';
      const tpl = (f) => `plop-templates/${f}`;
      return [
        { type: 'add', path: `${base}.tsx`, templateFile: tpl('component.tsx.hbs') },
        { type: 'add', path: `${base}.styles.ts`, templateFile: tpl('styles.ts.hbs') },
        { type: 'add', path: `${base}.test.tsx`, templateFile: tpl('test.tsx.hbs') },
        { type: 'add', path: `${base}.stories.tsx`, templateFile: tpl('stories.tsx.hbs') },
      ];
    },
  });
};
