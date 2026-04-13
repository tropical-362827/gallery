import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Character } from '../types/gallery';
import { trackCharacterDownload } from '../utils/analytics';
import { useParams } from 'react-router-dom';
import { convertCard, type ConvertTarget } from 'koikatu.js';
import {
  buildConvertedFileName,
  detectCardSource,
  getAvailableTargets,
  getSourceFromGameId,
  getTargetLabel,
} from '../utils/characterCardConversion';

interface CharacterItemProps {
  character: Character;
}

type DownloadTarget = ConvertTarget | 'original';

const CharacterContainer = styled.div`
  background-color: var(--surface-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px var(--shadow-color);
  }
`;

const CharacterImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  transition: filter 0.3s ease;
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const CharacterInfo = styled.div`
  padding: var(--spacing-md);
  flex: 1;
`;

const CharacterName = styled.h4`
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
  font-size: 1.2rem;
`;

const CharacterDescription = styled.p`
  color: var(--text-secondary-color);
  margin-bottom: 0;
  font-size: 0.9rem;
`;

const CharacterActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-md) var(--spacing-md);
`;

const ActionDivider = styled.div`
  width: 100%;
  height: 1px;
  background: color-mix(in srgb, var(--border-color) 70%, white 30%);
`;

const ConvertButton = styled.button<{ $isLoading: boolean }>`
  width: 100%;
  border: none;
  border-radius: 999px;
  padding: var(--spacing-sm) var(--spacing-md);
  background: ${({ $isLoading }) =>
    $isLoading ? 'var(--border-color)' : 'var(--primary-color)'};
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  opacity: ${({ disabled }) => (disabled ? '0.65' : '1')};

  &:hover {
    background: ${({ $isLoading }) =>
      $isLoading ? 'var(--border-color)' : 'var(--secondary-color)'};
  }
`;

const HelperText = styled.p`
  color: var(--text-secondary-color);
  font-size: 0.8rem;
  padding: 0 var(--spacing-md) var(--spacing-md);
  margin: 0;
`;

const DownloadMessage = styled.div<{ $isVisible: boolean; $tone: 'success' | 'error' }>`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ $tone }) =>
    $tone === 'success' ? 'var(--primary-color)' : 'var(--accent-color)'};
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: ${({ $isVisible }) => ($isVisible ? '1' : '0')};
  transform: ${({ $isVisible }) =>
    $isVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(20px)'};
  pointer-events: ${({ $isVisible }) => ($isVisible ? 'auto' : 'none')};
`;

export default function CharacterItem({ character }: CharacterItemProps) {
  const { gameId } = useParams<{ gameId: string }>();
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState<'success' | 'error'>('success');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [isResolvingSource, setIsResolvingSource] = useState(false);
  const [source, setSource] = useState(() => getSourceFromGameId(gameId));
  const [activeTarget, setActiveTarget] = useState<DownloadTarget | null>(null);
  const downloadTimerRef = useRef<number | null>(null);
  const cardBufferRef = useRef<ArrayBuffer | null>(null);
  const availableTargets = getAvailableTargets(source);
  const fileName = character.image.split('/').pop() || `character-${character.id}.png`;

  const showMessage = (nextMessage: string, tone: 'success' | 'error') => {
    if (downloadTimerRef.current) {
      window.clearTimeout(downloadTimerRef.current);
    }

    setMessage(nextMessage);
    setMessageTone(tone);
    setIsMessageVisible(true);

    downloadTimerRef.current = window.setTimeout(() => {
      setIsMessageVisible(false);
    }, 3000);
  };

  const loadCardBuffer = async () => {
    if (cardBufferRef.current) {
      return cardBufferRef.current;
    }

    const response = await fetch(character.image);
    if (!response.ok) {
      throw new Error(`Failed to fetch character card: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    cardBufferRef.current = buffer;
    return buffer;
  };

  useEffect(() => {
    const initialSource = getSourceFromGameId(gameId);
    setSource(initialSource);
    setActiveTarget(null);
    cardBufferRef.current = null;

    if (initialSource) {
      setIsResolvingSource(false);
      return;
    }

    let isMounted = true;
    setIsResolvingSource(true);

    void (async () => {
      try {
        let buffer = cardBufferRef.current;

        if (!buffer) {
          buffer = await fetch(character.image).then(response => {
            if (!response.ok) {
              throw new Error(`Failed to fetch character card: ${response.status}`);
            }

            return response.arrayBuffer();
          });
        }

        if (!buffer) {
          throw new Error('Character card buffer is empty');
        }

        cardBufferRef.current = buffer;
        const detectedSource = detectCardSource(buffer);

        if (!isMounted) {
          return;
        }

        setSource(detectedSource);
      } catch (error) {
        console.error('キャラカード形式の判定に失敗しました:', error);

        if (!isMounted) {
          return;
        }

        setSource(null);
      } finally {
        if (isMounted) {
          setIsResolvingSource(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [character.image, gameId]);

  useEffect(() => {
    return () => {
      if (downloadTimerRef.current) {
        window.clearTimeout(downloadTimerRef.current);
      }
    };
  }, []);

  const handleDownload = async (target: ConvertTarget) => {
    try {
      setActiveTarget(target);

      const input = await loadCardBuffer();
      const converted = convertCard(input, target);
      const blob = new Blob([converted], { type: 'image/png' });
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = buildConvertedFileName(fileName, target);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);

      if (gameId) {
        trackCharacterDownload(gameId, character.id, character.name, 'converted', target);
      }

      showMessage(`${getTargetLabel(target)}向けに変換してダウンロードしました`, 'success');
    } catch (error) {
      console.error('ダウンロード中にエラーが発生しました:', error);
      showMessage(`${getTargetLabel(target)}への変換に失敗しました`, 'error');
    } finally {
      setActiveTarget(null);
    }
  };

  const handleOriginalDownload = async () => {
    try {
      setActiveTarget('original');

      const input = await loadCardBuffer();
      const blob = new Blob([input], { type: 'image/png' });
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);

      if (gameId) {
        trackCharacterDownload(gameId, character.id, character.name, 'original', 'original');
      }

      showMessage('オリジナルをダウンロードしました', 'success');
    } catch (error) {
      console.error('オリジナルのダウンロード中にエラーが発生しました:', error);
      showMessage('オリジナルのダウンロードに失敗しました', 'error');
    } finally {
      setActiveTarget(null);
    }
  };

  return (
    <CharacterContainer>
      <CharacterImage 
        src={character.image} 
        alt={character.name} 
      />
      <CharacterInfo>
        <CharacterName>{character.name}</CharacterName>
        <CharacterDescription>{character.description}</CharacterDescription>
      </CharacterInfo>

      <CharacterActions>
        <ConvertButton
          type="button"
          $isLoading={activeTarget === 'original'}
          disabled={activeTarget !== null}
          onClick={() => {
            void handleOriginalDownload();
          }}
        >
          {activeTarget === 'original' ? 'ダウンロード中...' : 'キャラクターをDL'}
        </ConvertButton>

        {availableTargets.length > 0 && <ActionDivider />}

        {availableTargets.map(target => (
          <ConvertButton
            key={target}
            type="button"
            $isLoading={activeTarget === target}
            disabled={activeTarget !== null || isResolvingSource}
            onClick={() => {
              void handleDownload(target);
            }}
          >
            {activeTarget === target ? '変換中...' : `${getTargetLabel(target)}向けに変換してDL`}
          </ConvertButton>
        ))}
      </CharacterActions>

      {isResolvingSource && (
        <HelperText>対応する変換形式を確認中です。</HelperText>
      )}

      {!isResolvingSource && availableTargets.length === 0 && (
        <HelperText>このカードで利用できるのはオリジナルDLのみです。</HelperText>
      )}

      <DownloadMessage $isVisible={isMessageVisible} $tone={messageTone}>
        {message}
      </DownloadMessage>
    </CharacterContainer>
  );
}
