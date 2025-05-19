import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Game } from '../types/gallery';
import { fetchGalleryData } from '../utils/galleryData';
import SceneItem from '../components/SceneItem';
import CharacterItem from '../components/CharacterItem';

const PageTitle = styled.h1`
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
  text-align: center;
`;

const PageDescription = styled.p`
  color: var(--text-secondary-color);
  text-align: center;
  max-width: 800px;
  margin: 0 auto var(--spacing-xl);
`;

const SectionTitle = styled.h2`
  margin: var(--spacing-xl) 0 var(--spacing-lg);
  border-bottom: 2px solid var(--border-color);
  padding-bottom: var(--spacing-sm);
`;

const ScenesSection = styled.section`
  margin-bottom: var(--spacing-xxl);
`;

const CharactersSection = styled.section`
  margin-bottom: var(--spacing-xxl);
`;

const CharactersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
`;

const BackButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: 4px;
  font-weight: 600;
  margin-bottom: var(--spacing-xl);
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: var(--secondary-color);
  }
  
  &::before {
    content: '←';
    margin-right: var(--spacing-sm);
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  background-color: var(--surface-color);
  border-radius: 8px;
  color: var(--accent-color);
`;

export default function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchGalleryData();
        
        const foundGame = data.games.find(g => g.id === gameId);
        if (foundGame) {
          setGame(foundGame);
        } else {
          setError('指定されたゲームが見つかりませんでした。');
        }
      } catch (err) {
        setError('ギャラリーデータの読み込みに失敗しました。');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [gameId]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  if (isLoading) {
    return <div>読み込み中...</div>;
  }
  
  if (error || !game) {
    return (
      <>
        <BackButton onClick={handleBack}>戻る</BackButton>
        <ErrorMessage>{error || 'ゲームデータが見つかりませんでした。'}</ErrorMessage>
      </>
    );
  }
  
  return (
    <>
      <BackButton onClick={handleBack}>戻る</BackButton>
      
      <PageTitle>{game.title}</PageTitle>
      <PageDescription>{game.description}</PageDescription>
      
      <ScenesSection>
        <SectionTitle>シーン</SectionTitle>
        {game.scenes.map(scene => (
          <SceneItem key={scene.id} scene={scene} />
        ))}
      </ScenesSection>
      
      <CharactersSection>
        <SectionTitle>キャラクター</SectionTitle>
        <CharactersGrid>
          {game.characters.map(character => (
            <CharacterItem key={character.id} character={character} />
          ))}
        </CharactersGrid>
      </CharactersSection>
    </>
  );
}