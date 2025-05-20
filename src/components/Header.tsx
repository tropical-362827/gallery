import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { GalleryData } from '../types/gallery';
import { fetchGalleryData, getGamesForNavigation } from '../utils/galleryData';

const HeaderContainer = styled.header`
  background-color: var(--surface-color);
  box-shadow: 0 2px 15px var(--shadow-color);
  padding: var(--spacing-md) var(--spacing-lg);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--border-color);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const Logo = styled(Link)`
  font-size: 1.4rem;
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--primary-color);
  margin-right: var(--spacing-sm);
  
  &:hover {
    color: var(--secondary-color);
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  color: var(--text-color);
  margin-right: var(--spacing-xs);
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    color: var(--primary-color);
  }
`;

interface NavProps {
  $isOpen: boolean;
}

const Nav = styled.nav<NavProps>`
  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: var(--surface-color);
    padding: var(--spacing-md);
    box-shadow: 0 4px 8px var(--shadow-color);
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const NavItem = styled.li`
  margin-left: var(--spacing-md);
  
  @media (max-width: 768px) {
    margin: var(--spacing-xs) 0;
  }
`;

const NavLink = styled(Link) <{ $isActive: boolean }>`
  color: ${({ $isActive }) => $isActive ? 'var(--primary-color)' : 'var(--text-color)'};
  font-weight: ${({ $isActive }) => $isActive ? '600' : '400'};
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ $isActive }) => $isActive ? '70%' : '0'};
    height: 2px;
    background-color: var(--primary-color);
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: var(--primary-color);
    
    &:after {
      width: 70%;
    }
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [galleryData, setGalleryData] = useState<GalleryData | null>(null);
  const location = useLocation();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchGalleryData();
        setGalleryData(data);
      } catch (error) {
        console.error('Error fetching gallery data for navigation:', error);
      }
    }

    loadData();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // ナビゲーション用のゲーム一覧を取得
  const games = getGamesForNavigation(galleryData);

  return (
    <HeaderContainer>
      <HeaderContent>
        <LeftSection>
          <Logo to="/" onClick={closeMenu}>Tropical Trove</Logo>
          <SocialLink
            href="https://x.com/tropical-362827"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </SocialLink>
          <SocialLink
            href="https://github.com/tropical-362827/gallery"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </SocialLink>
        </LeftSection>

        <MenuButton onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? '✕' : '☰'}
        </MenuButton>

        <Nav $isOpen={isMenuOpen}>
          <NavList>
            <NavItem>
              <NavLink to="/" $isActive={location.pathname === '/'} onClick={closeMenu}>
                Home
              </NavLink>
            </NavItem>

            {/* ゲームリンクを動的に生成 */}
            {games.map(game => (
              <NavItem key={game.id}>
                <NavLink
                  to={`/${game.id}`}
                  $isActive={location.pathname === `/${game.id}`}
                  onClick={closeMenu}
                >
                  {game.title}
                </NavLink>
              </NavItem>
            ))}
          </NavList>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
}