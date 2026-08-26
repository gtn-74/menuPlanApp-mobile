/// <reference types="jest" />

import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Dot } from './Dot';

/**
 * atom のテスト観点:
 *  - props → 見た目（スタイル）の写像が正しいか
 *  - デフォルト値が効くか
 * ロジックが無いので「描画されること」と「propsの反映」を軽く確認するだけでよい。
 *
 * ※ RNTL 14 では render() の戻り値ではなく `screen` からクエリする。
 */
describe('Dot (atom)', () => {
  it('color と size が style に反映される', () => {
    render(<Dot color="#FF0000" size={10} testID="dot" />);
    const dot = screen.getByTestId('dot');
    // style は配列で渡しているので flatten して検証
    const style = Object.assign({}, ...dot.props.style);

    expect(style.backgroundColor).toBe('#FF0000');
    expect(style.width).toBe(10);
    expect(style.height).toBe(10);
    expect(style.borderRadius).toBe(5);
  });

  it('size 未指定ならデフォルト 6 になる', () => {
    render(<Dot color="#00FF00" testID="dot" />);
    const style = Object.assign({}, ...screen.getByTestId('dot').props.style);
    expect(style.width).toBe(6);
    expect(style.borderRadius).toBe(3);
  });
});
