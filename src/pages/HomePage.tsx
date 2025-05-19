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
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  background: linear-gradient(120deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.2rem;
  color: var(--text-secondary-color);
  max-width: 700px;
  margin: 0 auto var(--spacing-lg);
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-xl);
`;

const GameCard = styled(Link)`
  background-color: var(--surface-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  color: var(--text-color);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px var(--shadow-color);
    color: var(--text-color);
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
  color: var(--primary-color);
  font-size: 1.5rem;
  margin-bottom: var(--spacing-sm);
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
        <HeroTitle>ゲームギャラリー</HeroTitle>
        <HeroDescription>
          お気に入りのゲームシーンや魅力的なキャラクターを探索しましょう。
          気に入ったシーンはクリックすることでダウンロードできます。
        </HeroDescription>
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