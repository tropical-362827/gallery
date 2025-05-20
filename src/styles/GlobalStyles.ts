import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    /* 淡い色で明るいカラーパレット */
    --primary-color: #e75c48;  /* 濃いめのサーモンピンク */
    --title-color: #d84936;    /* タイトル用の濃いめの赤 */
    --secondary-color: #ffd384; /* 淡いオレンジイエロー */
    --accent-color: #98ddca;   /* 淡いミントグリーン */
    --background-color: #f9f7f7; /* 明るいオフホワイト */
    --surface-color: #ffffff;   /* 純白 */
    --text-color: #555555;      /* ダークグレー */
    --text-secondary-color: #888888; /* ミディアムグレー */
    --border-color: #e0e0e0;    /* ライトグレー */
    --shadow-color: rgba(0, 0, 0, 0.05); /* 薄い影 */
    
    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-xxl: 48px;
    
    /* Fonts */
    --font-main: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    --font-heading: 'Montserrat', 'Segoe UI', 'Roboto', sans-serif;
    --font-title: 'Playfair Display', 'Times New Roman', serif;
    --font-elegant: 'Lora', Georgia, serif;
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    font-family: var(--font-main);
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: var(--secondary-color);
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    margin-bottom: var(--spacing-md);
    line-height: 1.3;
    font-weight: 600;
    color: var(--text-color);
  }
  
  h1 {
    font-size: 2.5rem;
    letter-spacing: 1px;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  h3 {
    font-size: 1.75rem;
  }
  
  p {
    margin-bottom: var(--spacing-md);
  }
  
  button {
    cursor: pointer;
    font-family: var(--font-main);
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--background-color);
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 5px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary-color);
  }
`;

export default GlobalStyles;