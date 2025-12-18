import { describe, it, expect, vi } from "vitest";
import { FeatureFlagClient } from "../../src/core/client";
import { StaticProvider } from "../../src/core/providers/static";

describe("FeatureFlagClient", () => {
  it("초기화 전에는 isInitialized가 false이다", () => {
    const client = new FeatureFlagClient({
      provider: new StaticProvider({}),
    });

    expect(client.isInitialized()).toBe(false);
  });

  it("초기화 후에는 isInitialized가 true이다", async () => {
    const client = new FeatureFlagClient({
      provider: new StaticProvider({}),
    });

    await client.init();

    expect(client.isInitialized()).toBe(true);
  });

  it("초기화 전 isEnabled 호출 시 defaultValue를 반환한다", () => {
    const client = new FeatureFlagClient({
      provider: new StaticProvider({ "feature-a": { enabled: true } }),
      defaultValue: false,
    });

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = client.isEnabled("feature-a");

    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("초기화 후 isEnabled가 정상 동작한다", async () => {
    const client = new FeatureFlagClient({
      provider: new StaticProvider({
        "feature-a": { enabled: true },
        "feature-b": { enabled: false },
      }),
    });

    await client.init();

    expect(client.isEnabled("feature-a")).toBe(true);
    expect(client.isEnabled("feature-b")).toBe(false);
  });

  it("존재하지 않는 플래그는 defaultValue를 반환한다", async () => {
    const client = new FeatureFlagClient({
      provider: new StaticProvider({}),
      defaultValue: false,
    });

    await client.init();

    expect(client.isEnabled("unknown")).toBe(false);
  });

  it("getFlag가 정상 동작한다", async () => {
    const client = new FeatureFlagClient({
      provider: new StaticProvider({
        "feature-a": { enabled: true, metadata: { version: 2 } },
      }),
    });

    await client.init();

    expect(client.getFlag("feature-a")).toEqual({
      enabled: true,
      metadata: { version: 2 },
    });
    expect(client.getFlag("unknown")).toBeNull();
  });

  it("getAllFlags가 정상 동작한다", async () => {
    const flags = {
      "feature-a": { enabled: true },
      "feature-b": { enabled: false },
    };
    const client = new FeatureFlagClient({
      provider: new StaticProvider(flags),
    });

    await client.init();

    expect(client.getAllFlags()).toEqual(flags);
  });

  it("refresh가 캐시를 갱신한다", async () => {
    const provider = new StaticProvider({
      "feature-a": { enabled: false },
    });
    const client = new FeatureFlagClient({ provider });

    await client.init();
    expect(client.isEnabled("feature-a")).toBe(false);

    provider.setFlag("feature-a", { enabled: true });
    await client.refresh();

    expect(client.isEnabled("feature-a")).toBe(true);
  });

  it("clearCache가 초기화 상태를 리셋한다", async () => {
    const client = new FeatureFlagClient({
      provider: new StaticProvider({}),
    });

    await client.init();
    expect(client.isInitialized()).toBe(true);

    client.clearCache();

    expect(client.isInitialized()).toBe(false);
  });
});
