import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useI18n } from '../i18n';
import { getLocalizedTargetLabel, getLocalizedTargetShortLabel } from '../i18n/config';
import { Scene } from '../types/gallery';
import { trackSceneDownload } from '../utils/analytics';
import {
  getAvailableTargets,
  getSourceFromGameId,
} from '../utils/characterCardConversion';
import { convertSceneInWorker } from '../utils/sceneConversion';
import {
  getSceneFamily,
  isHcSceneTarget,
  isKkSceneTarget,
  type SceneTarget,
} from '../utils/sceneConversionTypes';

function isSceneTarget(value: string): value is SceneTarget {
  return isHcSceneTarget(value) || isKkSceneTarget(value);
}

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
  align-items: center;
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

const SceneActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
`;

const ConvertButton = styled.button<{ $isLoading: boolean }>`
  border: none;
  border-radius: 999px;
  padding: 8px 14px;
  background: ${({ $isLoading }) =>
    $isLoading
      ? 'var(--border-color)'
      : 'color-mix(in srgb, var(--primary-color) 60%, white 35%)'};
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  opacity: ${({ disabled }) => (disabled ? '0.65' : '1')};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  white-space: nowrap;

  &:hover {
    background: ${({ $isLoading }) =>
      $isLoading
        ? 'var(--border-color)'
        : 'color-mix(in srgb, var(--primary-color) 72%, white 28%)'};
  }
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

function buildSceneFileName(dataImage: string, target: SceneTarget): string {
  const fallback = dataImage.split('/').pop() || 'scene.png';
  const stem = fallback.replace(/\.png$/i, '');
  return `${stem}-${target.toLowerCase()}.png`;
}

export default function SceneItem({ scene }: SceneItemProps) {
  const { locale, messages } = useI18n();
  const { gameId } = useParams<{ gameId: string }>();
  const [showDownloadMessage, setShowDownloadMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState<'success' | 'error'>('success');
  const [activeTarget, setActiveTarget] = useState<SceneTarget | null>(null);
  const cachedBytesRef = useRef<Uint8Array | null>(null);
  const messageTimerRef = useRef<number | null>(null);

  const source = getSourceFromGameId(gameId);
  const sceneTargets: SceneTarget[] = source && isSceneTarget(source)
    ? getAvailableTargets(source).filter(isSceneTarget)
    : [];

  useEffect(() => {
    return () => {
      if (messageTimerRef.current) {
        window.clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  const showMessage = (next: string, tone: 'success' | 'error') => {
    if (messageTimerRef.current) {
      window.clearTimeout(messageTimerRef.current);
    }
    setMessage(next);
    setMessageTone(tone);
    setShowDownloadMessage(true);
    messageTimerRef.current = window.setTimeout(() => {
      setShowDownloadMessage(false);
    }, 3000);
  };

  const triggerDownload = (bytes: Uint8Array, fileName: string) => {
    const blob = new Blob([bytes as BlobPart], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const ensureSceneBytes = async (): Promise<Uint8Array> => {
    if (cachedBytesRef.current) return cachedBytesRef.current;
    const response = await fetch(scene.dataImage);
    if (!response.ok) {
      throw new Error(`Failed to fetch scene: ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    cachedBytesRef.current = bytes;
    return bytes;
  };

  const handleOriginalDownload = async () => {
    try {
      const bytes = await ensureSceneBytes();
      const fileName = scene.dataImage.split('/').pop() || `scene-${scene.id}.png`;
      triggerDownload(bytes, fileName);

      if (gameId) {
        trackSceneDownload(gameId, scene.id, scene.title);
      }
      showMessage(messages.sceneItem.downloadSuccess, 'success');
    } catch (error) {
      console.error('ダウンロード中にエラーが発生しました:', error);
    }
  };

  const handleConvert = async (target: SceneTarget) => {
    const targetLabel = getLocalizedTargetLabel(target, locale);
    try {
      setActiveTarget(target);
      const bytes = await ensureSceneBytes();
      const result = await convertSceneInWorker(getSceneFamily(target), bytes, target);
      const fileName = buildSceneFileName(scene.dataImage, target);
      triggerDownload(result.bytes, fileName);

      if (gameId) {
        trackSceneDownload(gameId, scene.id, scene.title);
      }
      showMessage(messages.sceneItem.convertSuccess(targetLabel), 'success');
    } catch (error) {
      console.error('シーン変換中にエラーが発生しました:', error);
      showMessage(messages.sceneItem.convertError(targetLabel), 'error');
    } finally {
      setActiveTarget(null);
    }
  };

  return (
    <SceneContainer>
      <SceneImage
        src={scene.displayImage}
        alt={scene.title}
        onClick={() => {
          void handleOriginalDownload();
        }}
      />
      <SceneInfo>
        <SceneText>
          <SceneTitle>{scene.title}</SceneTitle>
          <SceneDescription>{scene.description}</SceneDescription>
        </SceneText>
        <SceneActionsGroup>
          {sceneTargets.map(target => {
            const isLoading = activeTarget === target;
            const shortLabel = getLocalizedTargetShortLabel(target, locale);
            const fullLabel = getLocalizedTargetLabel(target, locale);
            return (
              <ConvertButton
                key={target}
                type="button"
                $isLoading={isLoading}
                disabled={activeTarget !== null}
                aria-label={messages.sceneItem.convertButton(fullLabel)}
                title={messages.sceneItem.convertButton(fullLabel)}
                onClick={() => {
                  void handleConvert(target);
                }}
              >
                {isLoading
                  ? messages.sceneItem.loadingConvert(shortLabel)
                  : messages.sceneItem.convertButton(shortLabel)}
              </ConvertButton>
            );
          })}
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
        </SceneActionsGroup>
      </SceneInfo>

      <DownloadMessage $isVisible={showDownloadMessage} $tone={messageTone}>
        {message}
      </DownloadMessage>
    </SceneContainer>
  );
}
