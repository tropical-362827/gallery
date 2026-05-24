export const HC_SCENE_TARGETS = ['HC', 'SV', 'AC'] as const;
export type HcSceneTarget = typeof HC_SCENE_TARGETS[number];

export const KK_SCENE_TARGETS = ['KK', 'KKS'] as const;
export type KkSceneTarget = typeof KK_SCENE_TARGETS[number];

export type SceneFamily = 'hc' | 'kk';
export type SceneTarget = HcSceneTarget | KkSceneTarget;

export function isHcSceneTarget(value: string): value is HcSceneTarget {
  return (HC_SCENE_TARGETS as readonly string[]).includes(value);
}

export function isKkSceneTarget(value: string): value is KkSceneTarget {
  return (KK_SCENE_TARGETS as readonly string[]).includes(value);
}

export function getSceneFamily(target: SceneTarget): SceneFamily {
  return isHcSceneTarget(target) ? 'hc' : 'kk';
}
