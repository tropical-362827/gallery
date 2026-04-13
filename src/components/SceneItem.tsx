import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useI18n } from '../i18n';
import { Scene } from '../types/gallery';
import { trackSceneDownload } from '../utils/analytics';

interface SceneItemProps {
  scene: Scene;
}

const SceneContainer = styled.div`
  margin-bottom: var(--spacing-xl);
  background-color: var(--surface-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px var(--shadow-color);
`;

const SceneImage = styled.img`
  width: 100%;
  height: auto;
  cursor: pointer;
  transition: filter 0.3s ease;
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const SceneInfo = styled.div`
  padding: var(--spacing-lg);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    padding: var(--spacing-sm) var(--spacing-md);
  }
`;

const SceneText = styled.div`
  flex: 1;
  min-width: 0;
`;

const SceneTitle = styled.h3`
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const SceneDescription = styled.p`
  color: var(--text-secondary-color);
  margin-bottom: 0;
`;

const ScenePostLink = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  background: #131313;
  box-shadow: 0 6px 18px var(--shadow-color);
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: #474747;
  }

  svg {
    width: 18px;
    height: 18px;
  }
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

export default function SceneItem({ scene }: SceneItemProps) {
  const { messages } = useI18n();
  const [showDownloadMessage, setShowDownloadMessage] = useState(false);
  const { gameId } = useParams<{ gameId: string }>();

  const handleDownload = async () => {
    try {
      // データ用画像をダウンロード
      const response = await fetch(scene.dataImage);
      const blob = await response.blob();

      // ファイル名を取得（URLから最後の部分を抽出）
      const fileName = scene.dataImage.split('/').pop() || `scene-${scene.id}.png`;

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
        trackSceneDownload(gameId, scene.id, scene.title);
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
    <SceneContainer>
      <SceneImage
        src={scene.displayImage}
        alt={scene.title}
        onClick={handleDownload}
      />
      <SceneInfo>
        <SceneText>
          <SceneTitle>{scene.title}</SceneTitle>
          <SceneDescription>{scene.description}</SceneDescription>
        </SceneText>
        {scene.xPostUrl ? (
          <ScenePostLink
            href={scene.xPostUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={messages.sceneItem.openXPost(scene.title)}
            title={messages.sceneItem.openXPost(scene.title)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </ScenePostLink>
        ) : null}
      </SceneInfo>

      <DownloadMessage $isVisible={showDownloadMessage}>
        {messages.sceneItem.downloadSuccess}
      </DownloadMessage>
    </SceneContainer>
  );
}
