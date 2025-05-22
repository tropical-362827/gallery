import React from 'react';
import styled from 'styled-components';
import { useTheme, PatternName } from '../styles/ThemeContext';

const SwitcherContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--surface-color);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 10px var(--shadow-color);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PatternButton = styled.button<{ isActive: boolean }>`
  background-color: ${({ isActive }) => isActive ? 'var(--primary-color)' : 'var(--background-color)'};
  color: ${({ isActive }) => isActive ? 'white' : 'var(--text-color)'};
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ isActive }) => isActive ? 'var(--primary-color)' : 'var(--border-color)'};
  }
`;

const SwitcherTitle = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary-color);
  margin-bottom: 5px;
  text-align: center;
`;

const patternOptions: { value: PatternName; label: string }[] = [
  { value: 'softDots', label: '水玉模様' },
  { value: 'wavyLines', label: '波線' },
  { value: 'tropicalLeaves', label: '熱帯の葉' },
  { value: 'subtleGrid', label: '格子模様' },
  { value: 'pastelTriangles', label: '三角形' },
  { value: 'japaneseWaves', label: '和風波紋' },
  { value: 'tropicalStripes', label: '砂浜縞模様' },
];

const ThemeSwitcher = () => {
  const { currentPattern, setPattern } = useTheme();

  return (
    <SwitcherContainer>
      <SwitcherTitle>背景パターン</SwitcherTitle>
      {patternOptions.map((option) => (
        <PatternButton
          key={option.value}
          isActive={currentPattern === option.value}
          onClick={() => setPattern(option.value)}
        >
          {option.label}
        </PatternButton>
      ))}
    </SwitcherContainer>
  );
};

export default ThemeSwitcher;