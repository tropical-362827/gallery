import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import CharacterItem from '../components/CharacterItem';
import SceneItem from '../components/SceneItem';
import { getLocalizedGameDescription, getLocalizedGameTitle, useI18n } from '../i18n';
import { Game } from '../types/gallery';
import { fetchGalleryData } from '../utils/galleryData';

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
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--spacing-md);
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
  const { locale, messages } = useI18n();
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setError(null);

      try {
        const data = await fetchGalleryData();

        const foundGame = data.games.find(g => g.id === gameId);
        if (foundGame) {
          setGame(foundGame);
        } else {
          setError(messages.gamePage.notFound);
        }
      } catch (err) {
        setError(messages.common.galleryLoadError);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [gameId, messages.common.galleryLoadError, messages.gamePage.notFound]);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <div>{messages.common.loading}</div>;
  }

  if (error || !game) {
    return (
      <>
        <BackButton onClick={handleBack}>{messages.gamePage.back}</BackButton>
        <ErrorMessage>{error || messages.gamePage.dataNotFound}</ErrorMessage>
      </>
    );
  }

  const localizedTitle = getLocalizedGameTitle(game.id, game.title, locale);
  const localizedDescription = getLocalizedGameDescription(game.id, game.description, locale);

  return (
    <>
      <PageTitle>{localizedTitle}</PageTitle>
      <PageDescription>{localizedDescription}</PageDescription>

      <ScenesSection>
        <SectionTitle>{messages.gamePage.scenes}</SectionTitle>
        {game.scenes.map(scene => (
          <SceneItem key={scene.id} scene={scene} />
        ))}
      </ScenesSection>

      <CharactersSection>
        <SectionTitle>{messages.gamePage.characters}</SectionTitle>
        <CharactersGrid>
          {game.characters.map(character => (
            <CharacterItem key={character.id} character={character} />
          ))}
        </CharactersGrid>
      </CharactersSection>
    </>
  );
}
