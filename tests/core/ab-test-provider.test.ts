import { describe, it, expect } from "vitest";
import { ABTestProvider } from "../../src/core/providers/ab-test";
import type { ABTestSDK } from "../../src/core/providers/ab-test";

function createMockSDK(variants: Record<string, string>): ABTestSDK {
  return {
    async getVariant(key: string) {
      return variants[key] ?? null;
    },
    async getAllVariants() {
      return variants;
    },
  };
}

describe("ABTestProvider", () => {
  it("new 그룹이면 enabled: true를 반환한다", async () => {
    const sdk = createMockSDK({ "experiment-1": "new" });
    const provider = new ABTestProvider({ sdk, treatmentValue: "new" });

    const flag = await provider.getFlag("experiment-1");

    expect(flag).toEqual({ enabled: true, metadata: { variant: "new" } });
  });

  it("old 그룹이면 enabled: false를 반환한다", async () => {
    const sdk = createMockSDK({ "experiment-1": "old" });
    const provider = new ABTestProvider({ sdk, treatmentValue: "new" });

    const flag = await provider.getFlag("experiment-1");

    expect(flag).toEqual({ enabled: false, metadata: { variant: "old" } });
  });

  it("존재하지 않는 실험은 null을 반환한다", async () => {
    const sdk = createMockSDK({});
    const provider = new ABTestProvider({ sdk, treatmentValue: "new" });

    const flag = await provider.getFlag("unknown");

    expect(flag).toBeNull();
  });

  it("모든 플래그를 반환한다", async () => {
    const sdk = createMockSDK({
      "experiment-1": "new",
      "experiment-2": "old",
    });
    const provider = new ABTestProvider({ sdk, treatmentValue: "new" });

    const allFlags = await provider.getAllFlags();

    expect(allFlags).toEqual({
      "experiment-1": { enabled: true, metadata: { variant: "new" } },
      "experiment-2": { enabled: false, metadata: { variant: "old" } },
    });
  });

  it("기본 treatmentValue는 treatment이다", async () => {
    const sdk = createMockSDK({ "experiment-1": "treatment" });
    const provider = new ABTestProvider({ sdk });

    const flag = await provider.getFlag("experiment-1");

    expect(flag?.enabled).toBe(true);
  });
});
