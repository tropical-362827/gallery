import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #6a3de8;
    --secondary-color: #9b78fa;
    --accent-color: #ff6b6b;
    --background-color: #0f0f1a;
    --surface-color: #1a1a2e;
    --text-color: #e6e6fa;
    --text-secondary-color: #b8b8d0;
    --border-color: #2a2a40;
    --shadow-color: rgba(0, 0, 0, 0.3);
    
    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-xxl: 48px;
    
    /* Fonts */
    --font-main: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    --font-heading: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
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
    color: var(--secondary-color);
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: var(--primary-color);
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
    width: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--surface-color);
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 5px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-color);
  }
`;

export default GlobalStyles;