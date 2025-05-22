import { css } from 'styled-components';

// 淡い色合いに合う背景パターンのバリエーション
export const backgroundPatterns = {
  // 1. 繊細な水玉模様
  softDots: css`
    background-color: var(--background-color);
    background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
    background-size: 20px 20px;
  `,

  // 2. 波線パターン - 熱帯のイメージにマッチする波模様
  wavyLines: css`
    background-color: var(--background-color);
    background-image: repeating-linear-gradient(
      -45deg, 
      transparent, 
      transparent 10px, 
      rgba(152, 221, 202, 0.1) 10px, 
      rgba(152, 221, 202, 0.1) 20px
    );
  `,

  // 3. 熱帯の葉っぱをイメージしたシンプルな模様
  tropicalLeaves: css`
    background-color: var(--background-color);
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 20c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm-15 30c-8.284 0-15-6.716-15-15 0-8.284 6.716-15 15-15 4.255 0 8.09 1.774 10.796 4.621C28.474 21.364 30 16.927 30 12c0-6.627-5.373-12-12-12S6 5.373 6 12c0 4.582 2.57 8.565 6.35 10.617C5.034 25.227 0 32.35 0 40.755 0 51.688 8.922 60 19.937 60h20.127C51.155 60 60 51.32 60 40.755 60 30.19 50 20 40 20c-5.523 0-10 4.477-10 10s4.477 10 10 10c8.284 0 15 6.716 15 15 0 8.284-6.716 15-15 15H15z' fill='%2398ddca' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E");
  `,

  // 4. 繊細な格子模様
  subtleGrid: css`
    background-color: var(--background-color);
    background-image: linear-gradient(var(--border-color) 1px, transparent 1px),
      linear-gradient(90deg, var(--border-color) 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: -1px -1px;
  `,

  // 5. パステル調の三角形パターン
  pastelTriangles: css`
    background-color: var(--background-color);
    background-image: url("data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18 0v18L0 18zM36 18H18v18z' fill='%23ffd384' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E");
  `,

  // 6. 和風の波紋模様
  japaneseWaves: css`
    background-color: var(--background-color);
    background-image: url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e75c48' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6h-2c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  `,

  // 7. 熱帯の砂浜をイメージした柔らかな縞模様
  tropicalStripes: css`
    background: var(--background-color);
    background-image: 
      linear-gradient(135deg, var(--secondary-color) 25%, transparent 25%), 
      linear-gradient(225deg, var(--secondary-color) 25%, transparent 25%), 
      linear-gradient(45deg, var(--secondary-color) 25%, transparent 25%), 
      linear-gradient(315deg, var(--secondary-color) 25%, var(--background-color) 25%);
    background-position: 10px 0, 10px 0, 0 0, 0 0;
    background-size: 20px 20px;
    background-repeat: repeat;
    opacity: 0.1;
  `
};

// パターンをボディに適用するためのスタイル
export const applyBackgroundPattern = (patternName: keyof typeof backgroundPatterns) => {
  return css`
    body {
      ${backgroundPatterns[patternName]}
    }
  `;
};

export default backgroundPatterns;