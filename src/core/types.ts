export interface FeatureConfig {
  enabled: boolean;
  metadata?: Record<string, unknown>;
}

export interface FeatureFlagProvider {
  getFlag(key: string): Promise<FeatureConfig | null>;
  getAllFlags(): Promise<Record<string, FeatureConfig>>;
}
