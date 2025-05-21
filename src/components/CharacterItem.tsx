import { useState } from 'react';
import styled from 'styled-components';
import { Character } from '../types/gallery';
import { trackCharacterDownload } from '../utils/analytics';
import { useParams } from 'react-router-dom';

interface CharacterItemProps {
  character: Character;
}

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
  cursor: pointer;
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

const DownloadMessage = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--primary-color);
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
  const [showDownloadMessage, setShowDownloadMessage] = useState(false);
  const { gameId } = useParams<{ gameId: string }>();
  
  const handleDownload = async () => {
    try {
      // キャラクター画像をダウンロード
      const response = await fetch(character.image);
      const blob = await response.blob();
      
      // ファイル名を取得（URLから最後の部分を抽出）
      const fileName = character.image.split('/').pop() || `character-${character.id}.png`;
      
      // ダウンロードリンクを作成
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      
      // リンクをクリックしてダウンロード
      link.click();
      
      // リンクを削除
      document.body.removeChild(link);
      
      // Google Analyticsにイベントを送信
      if (gameId) {
        trackCharacterDownload(gameId, character.id, character.name);
      }
      
      // ダウンロードメッセージを表示
      setShowDownloadMessage(true);
      
      // 3秒後にメッセージを非表示
      setTimeout(() => {
        setShowDownloadMessage(false);
      }, 3000);
      
    } catch (error) {
      console.error('ダウンロード中にエラーが発生しました:', error);
    }
  };
  
  return (
    <CharacterContainer>
      <CharacterImage 
        src={character.image} 
        alt={character.name} 
        onClick={handleDownload}
      />
      <CharacterInfo>
        <CharacterName>{character.name}</CharacterName>
        <CharacterDescription>{character.description}</CharacterDescription>
      </CharacterInfo>
      
      <DownloadMessage $isVisible={showDownloadMessage}>
        キャラクター画像をダウンロードしました
      </DownloadMessage>
    </CharacterContainer>
  );
}