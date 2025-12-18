import type {
  FeatureConfig,
  IFeatureFlagProvider,
  FeatureFlagClientOptions,
} from "./types";

export class FeatureFlagClient {
  private provider: IFeatureFlagProvider;
  private cache: Map<string, FeatureConfig> = new Map();
  private defaultValue: boolean;
  private initialized = false;

  constructor(options: FeatureFlagClientOptions) {
    this.provider = options.provider;
    this.defaultValue = options.defaultValue ?? false;
  }

  async init(): Promise<void> {
    const flags = await this.provider.getAllFlags();

    for (const [key, config] of Object.entries(flags)) {
      this.cache.set(key, config);
    }

    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  isEnabled(key: string): boolean {
    if (!this.initialized) {
      console.warn("[FeatureFlag] Client not initialized. Call init() first.");
      return this.defaultValue;
    }

    return this.cache.get(key)?.enabled ?? this.defaultValue;
  }

  getFlag(key: string): FeatureConfig | null {
    if (!this.initialized) {
      console.warn("[FeatureFlag] Client not initialized. Call init() first.");
      return null;
    }

    return this.cache.get(key) ?? null;
  }

  getAllFlags(): Record<string, FeatureConfig> {
    const flags: Record<string, FeatureConfig> = {};

    for (const [key, config] of this.cache.entries()) {
      flags[key] = config;
    }

    return flags;
  }

  async refresh(): Promise<void> {
    const flags = await this.provider.getAllFlags();

    this.cache.clear();
    for (const [key, config] of Object.entries(flags)) {
      this.cache.set(key, config);
    }
  }

  clearCache(): void {
    this.cache.clear();
    this.initialized = false;
  }
}
