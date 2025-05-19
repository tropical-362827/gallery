import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: var(--surface-color);
  box-shadow: 0 2px 10px var(--shadow-color);
  padding: var(--spacing-md) var(--spacing-lg);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  
  &:hover {
    color: var(--secondary-color);
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

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${({ $isActive }) => $isActive ? 'var(--primary-color)' : 'var(--text-color)'};
  font-weight: ${({ $isActive }) => $isActive ? '600' : '400'};
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary-color);
    background-color: rgba(106, 61, 232, 0.1);
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
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/" onClick={closeMenu}>ゲームギャラリー</Logo>
        
        <MenuButton onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? '✕' : '☰'}
        </MenuButton>
        
        <Nav $isOpen={isMenuOpen}>
          <NavList>
            <NavItem>
              <NavLink to="/" $isActive={location.pathname === '/'} onClick={closeMenu}>
                ホーム
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink 
                to="/game-1" 
                $isActive={location.pathname === '/game-1'} 
                onClick={closeMenu}
              >
                ゲーム1
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink 
                to="/game-2" 
                $isActive={location.pathname === '/game-2'} 
                onClick={closeMenu}
              >
                ゲーム2
              </NavLink>
            </NavItem>
          </NavList>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
}