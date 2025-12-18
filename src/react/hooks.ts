import { useFeatureFlagContext } from "./context";
import type { FeatureConfig } from "../core/types";

/**
 * 특정 피쳐가 활성화되어 있는지 확인
 */
export function useFeatureFlag(key: string): boolean {
  const { client, isReady } = useFeatureFlagContext();

  if (!isReady) {
    return false;
  }

  return client.isEnabled(key);
}

/**
 * 특정 피쳐의 상세 설정 조회
 */
export function useFeatureFlagConfig(key: string): FeatureConfig | null {
  const { client, isReady } = useFeatureFlagContext();

  if (!isReady) {
    return null;
  }

  return client.getFlag(key);
}

/**
 * 모든 피쳐 플래그 조회
 */
export function useAllFeatureFlags(): Record<string, FeatureConfig> {
  const { client, isReady } = useFeatureFlagContext();

  if (!isReady) {
    return {};
  }

  return client.getAllFlags();
}

/**
 * 초기화 상태 확인
 */
export function useFeatureFlagReady(): boolean {
  const { isReady } = useFeatureFlagContext();
  return isReady;
}
