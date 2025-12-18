import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { FeatureFlagProvider } from "../../src/react/context";
import {
  useFeatureFlag,
  useFeatureFlagConfig,
  useAllFeatureFlags,
  useFeatureFlagReady,
} from "../../src/react/hooks";
import { FeatureFlagClient } from "../../src/core/client";
import { StaticProvider } from "../../src/core/providers/static";

function createWrapper(client: FeatureFlagClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <FeatureFlagProvider client={client}>{children}</FeatureFlagProvider>
    );
  };
}

describe("useFeatureFlagReady", () => {
  it("초기화 후 true를 반환한다", async () => {
    const client = new FeatureFlagClient({
      provider: new StaticProvider({}),
    });

    const { result } = renderHook(() => useFeatureFlagReady(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});

describe("useFeatureFlag", () => {
  it("플래그 활성화 여부를 반환한다", async () => {
    const client = new FeatureFlagClient({
      provider: new StaticProvider({
        "feature-a": { enabled: true },
        "feature-b": { enabled: false },
      }),
    });

    const { result: resultA } = renderHook(() => useFeatureFlag("feature-a"), {
      wrapper: createWrapper(client),
    });

    const { result: resultB } = renderHook(() => useFeatureFlag("feature-b"), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => {
      expect(resultA.current).toBe(true);
      expect(resultB.current).toBe(false);
    });
  });

  it("존재하지 않는 플래그는 false를 반환한다", async () => {
    const client = new FeatureFlagClient({
      provider: new StaticProvider({}),
    });

    const { result } = renderHook(() => useFeatureFlag("unknown"), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });
});

describe("useFeatureFlagConfig", () => {
  it("플래그 설정을 반환한다", async () => {
    const client = new FeatureFlagClient({
      provider: new StaticProvider({
        "feature-a": { enabled: true, metadata: { version: 2 } },
      }),
    });

    const { result } = renderHook(() => useFeatureFlagConfig("feature-a"), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => {
      expect(result.current).toEqual({
        enabled: true,
        metadata: { version: 2 },
      });
    });
  });
});

describe("useAllFeatureFlags", () => {
  it("모든 플래그를 반환한다", async () => {
    const flags = {
      "feature-a": { enabled: true },
      "feature-b": { enabled: false },
    };
    const client = new FeatureFlagClient({
      provider: new StaticProvider(flags),
    });

    const { result } = renderHook(() => useAllFeatureFlags(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => {
      expect(result.current).toEqual(flags);
    });
  });
});
