import type { FeatureConfig, IFeatureFlagProvider } from "../types";

export interface ABTestSDK {
  getVariant(key: string): Promise<string | null>;
  getAllVariants(): Promise<Record<string, string>>;
}

export interface ABTestProviderOptions {
  sdk: ABTestSDK;
  treatmentValue?: string;
}

export class ABTestProvider implements IFeatureFlagProvider {
  private sdk: ABTestSDK;
  private treatmentValue: string;

  constructor(options: ABTestProviderOptions) {
    this.sdk = options.sdk;
    this.treatmentValue = options.treatmentValue ?? "treatment";
  }

  async getFlag(key: string): Promise<FeatureConfig | null> {
    const variant = await this.sdk.getVariant(key);

    if (variant === null) {
      return null;
    }

    return {
      enabled: variant === this.treatmentValue,
      metadata: { variant },
    };
  }

  async getAllFlags(): Promise<Record<string, FeatureConfig>> {
    const variants = await this.sdk.getAllVariants();
    const flags = {} as Record<string, FeatureConfig>;

    for (const [key, variant] of Object.entries(variants)) {
      flags[key] = {
        enabled: variant === this.treatmentValue,
        metadata: { variant },
      };
    }

    return flags;
  }
}
