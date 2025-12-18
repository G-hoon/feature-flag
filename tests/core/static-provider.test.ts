import { describe, it, expect } from "vitest";
import { StaticProvider } from "../../src/core/providers/static";

describe("StaticProvider", () => {
  it("플래그를 정상적으로 반환한다", async () => {
    const provider = new StaticProvider({
      "feature-a": { enabled: true },
      "feature-b": { enabled: false },
    });

    const flagA = await provider.getFlag("feature-a");
    const flagB = await provider.getFlag("feature-b");

    expect(flagA).toEqual({ enabled: true });
    expect(flagB).toEqual({ enabled: false });
  });

  it("존재하지 않는 플래그는 null을 반환한다", async () => {
    const provider = new StaticProvider({});

    const flag = await provider.getFlag("unknown");

    expect(flag).toBeNull();
  });

  it("모든 플래그를 반환한다", async () => {
    const flags = {
      "feature-a": { enabled: true },
      "feature-b": { enabled: false },
    };
    const provider = new StaticProvider(flags);

    const allFlags = await provider.getAllFlags();

    expect(allFlags).toEqual(flags);
  });

  it("setFlag로 플래그를 변경할 수 있다", async () => {
    const provider = new StaticProvider({
      "feature-a": { enabled: false },
    });

    provider.setFlag("feature-a", { enabled: true });
    const flag = await provider.getFlag("feature-a");

    expect(flag).toEqual({ enabled: true });
  });

  it("metadata를 포함한 플래그를 반환한다", async () => {
    const provider = new StaticProvider({
      "feature-a": { enabled: true, metadata: { version: 2 } },
    });

    const flag = await provider.getFlag("feature-a");

    expect(flag).toEqual({ enabled: true, metadata: { version: 2 } });
  });
});
