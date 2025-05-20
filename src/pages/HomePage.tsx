import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { GalleryData } from '../types/gallery';
import { fetchGalleryData } from '../utils/galleryData';

const Hero = styled.section`
  text-align: center;
  margin-bottom: var(--spacing-xxl);
`;

const HeroTitle = styled.h1`
  font-size: 4.2rem;
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  font-style: italic;
  letter-spacing: -1px;
  margin-bottom: var(--spacing-md);
  color: var(--title-color);
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
    letter-spacing: -0.5px;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.2rem;
  color: var(--text-secondary-color);
  max-width: 700px;
  margin: 0 auto var(--spacing-lg);
`;

const SocialContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: 24px;
  background-color: var(--accent-color);
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    filter: brightness(105%);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const GitHubLink = styled(SocialLink)`
  /* 両方同じスタイルにするため、オーバーライドしない */
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-xl);
`;

const GameCard = styled(Link)`
  background-color: var(--surface-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px var(--shadow-color);
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px var(--shadow-color);
    color: var(--text-color);
    border-color: var(--accent-color);
  }
`;

const GameImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const GameContent = styled.div`
  padding: var(--spacing-lg);
  flex: 1;
`;

const GameTitle = styled.h2`
  color: var(--text-color);
  font-size: 1.5rem;
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 30px;
    height: 2px;
    background-color: var(--primary-color);
  }
`;

const GameDescription = styled.p`
  color: var(--text-secondary-color);
  margin-bottom: 0;
`;

export default function HomePage() {
  const [galleryData, setGalleryData] = useState<GalleryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchGalleryData();
        setGalleryData(data);
      } catch (err) {
        setError('ギャラリーデータの読み込みに失敗しました。');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Hero>
        <HeroTitle>tropical trove</HeroTitle>
        <HeroDescription>
          Xにて公開しているゲームのSSを置いておく場所です！
        </HeroDescription>
        <HeroDescription>
          画像をクリックしてシーン/キャラデータをダウンロードできます！
        </HeroDescription>

        <SocialContainer>
          <SocialLink
            href="https://x.com/tropical_362827"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
            @tropical_362827
          </SocialLink>
          <GitHubLink
            href="https://github.com/tropical-362827/gallery"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            github
          </GitHubLink>
        </SocialContainer>
      </Hero>

      <GamesGrid>
        {galleryData?.games.map(game => (
          <GameCard key={game.id} to={`/${game.id}`}>
            <GameImage
              src={game.scenes[0]?.displayImage || 'placeholder.jpg'}
              alt={game.title}
            />
            <GameContent>
              <GameTitle>{game.title}</GameTitle>
              <GameDescription>{game.description}</GameDescription>
            </GameContent>
          </GameCard>
        ))}
      </GamesGrid>
    </>
  );
}