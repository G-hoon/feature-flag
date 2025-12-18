export interface FeatureConfig {
  enabled: boolean;
  metadata?: Record<string, unknown>;
}

export interface IFeatureFlagProvider {
  getFlag(key: string): Promise<FeatureConfig | null>;
  getAllFlags(): Promise<Record<string, FeatureConfig>>;
}

export interface FeatureFlagClientOptions {
  provider: IFeatureFlagProvider;
  defaultValue?: boolean;
}
