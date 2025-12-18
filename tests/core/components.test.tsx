import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { FeatureFlagProvider } from "../../src/react/context";
import { Feature } from "../../src/react/components";
import { FeatureFlagClient } from "../../src/core/client";
import { StaticProvider } from "../../src/core/providers/static";

describe("Feature 컴포넌트", () => {
  it("플래그가 활성화되면 children을 렌더링한다", async () => {
    const client = new FeatureFlagClient({
      provider: new StaticProvider({
        "feature-a": { enabled: true },
      }),
    });

    render(
      <FeatureFlagProvider client={client}>
        <Feature flag="feature-a">
          <div>새 기능</div>
        </Feature>
      </FeatureFlagProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("새 기능")).toBeInTheDocument();
    });
  });

  it("플래그가 비활성화되면 fallback을 렌더링한다", async () => {
    const client = new FeatureFlagClient({
      provider: new StaticProvider({
        "feature-a": { enabled: false },
      }),
    });

    render(
      <FeatureFlagProvider client={client}>
        <Feature flag="feature-a" fallback={<div>기존 기능</div>}>
          <div>새 기능</div>
        </Feature>
      </FeatureFlagProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("기존 기능")).toBeInTheDocument();
      expect(screen.queryByText("새 기능")).not.toBeInTheDocument();
    });
  });

  it("fallback이 없고 플래그가 비활성화되면 아무것도 렌더링하지 않는다", async () => {
    const client = new FeatureFlagClient({
      provider: new StaticProvider({
        "feature-a": { enabled: false },
      }),
    });

    render(
      <FeatureFlagProvider client={client}>
        <Feature flag="feature-a">
          <div>새 기능</div>
        </Feature>
      </FeatureFlagProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("새 기능")).not.toBeInTheDocument();
    });
  });
});
