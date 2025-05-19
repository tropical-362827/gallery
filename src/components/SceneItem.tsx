import { useState } from 'react';
import styled from 'styled-components';
import { Scene } from '../types/gallery';

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
`;

const SceneTitle = styled.h3`
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
`;

const SceneDescription = styled.p`
  color: var(--text-secondary-color);
  margin-bottom: 0;
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
  const [showDownloadMessage, setShowDownloadMessage] = useState(false);
  
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
        <SceneTitle>{scene.title}</SceneTitle>
        <SceneDescription>{scene.description}</SceneDescription>
      </SceneInfo>
      
      <DownloadMessage $isVisible={showDownloadMessage}>
        シーンデータをダウンロードしました
      </DownloadMessage>
    </SceneContainer>
  );
}