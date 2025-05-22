import { ReactNode } from 'react';
import { createGlobalStyle } from 'styled-components';
import { backgroundPatterns } from './BackgroundPattern';

// 固定パターンを適用するためのグローバルスタイル
const FixedBackgroundStyle = createGlobalStyle`
  body {
    ${backgroundPatterns['wavyLines']}
  }
`;

// テーマプロバイダーのプロップの型定義
interface ThemeProviderProps {
  children: ReactNode;
}

// テーマプロバイダーコンポーネント
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <>
      <FixedBackgroundStyle />
      {children}
    </>
  );
};

export default ThemeProvider;