import type { FeatureConfig, FeatureFlagProvider } from "../types";

export class StaticProvider implements FeatureFlagProvider {
  private flags: Record<string, FeatureConfig>;

  constructor(flags: Record<string, FeatureConfig>) {
    this.flags = flags;
  }

  async getFlag(key: string): Promise<FeatureConfig | null> {
    return this.flags[key] ?? null;
  }

  async getAllFlags(): Promise<Record<string, FeatureConfig>> {
    return { ...this.flags };
  }

  setFlag(key: string, config: FeatureConfig): void {
    this.flags[key] = config;
  }
}
