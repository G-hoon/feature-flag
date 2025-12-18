import type { FeatureConfig, FeatureFlagProvider } from "../types";

export interface APIProviderOptions {
  baseUrl: string;
  headers?: Record<string, string>;
}

export class APIProvider implements FeatureFlagProvider {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(options: APIProviderOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.headers = options.headers ?? {};
  }

  async getFlag(key: string): Promise<FeatureConfig | null> {
    try {
      const response = await fetch(`${this.baseUrl}/flags/${key}`, {
        headers: this.headers,
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch {
      return null;
    }
  }

  async getAllFlags(): Promise<Record<string, FeatureConfig>> {
    try {
      const response = await fetch(`${this.baseUrl}/flags`, {
        headers: this.headers,
      });

      if (!response.ok) {
        return {} as Record<string, FeatureConfig>;
      }

      return await response.json();
    } catch {
      return {} as Record<string, FeatureConfig>;
    }
  }
}
