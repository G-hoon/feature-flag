import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { APIProvider } from "../../src/core/providers/api";

describe("APIProvider", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getFlag가 API 응답을 반환한다", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ enabled: true, metadata: { version: 2 } }),
    });

    const provider = new APIProvider({ baseUrl: "https://api.example.com" });
    const flag = await provider.getFlag("feature-a");

    expect(flag).toEqual({ enabled: true, metadata: { version: 2 } });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/flags/feature-a",
      { headers: {} }
    );
  });

  it("API 실패 시 null을 반환한다", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    const provider = new APIProvider({ baseUrl: "https://api.example.com" });
    const flag = await provider.getFlag("feature-a");

    expect(flag).toBeNull();
  });

  it("네트워크 에러 시 null을 반환한다", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const provider = new APIProvider({ baseUrl: "https://api.example.com" });
    const flag = await provider.getFlag("feature-a");

    expect(flag).toBeNull();
  });

  it("getAllFlags가 API 응답을 반환한다", async () => {
    const flags = {
      "feature-a": { enabled: true },
      "feature-b": { enabled: false },
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => flags,
    });

    const provider = new APIProvider({ baseUrl: "https://api.example.com" });
    const result = await provider.getAllFlags();

    expect(result).toEqual(flags);
    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/flags", {
      headers: {},
    });
  });

  it("getAllFlags API 실패 시 빈 객체를 반환한다", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    const provider = new APIProvider({ baseUrl: "https://api.example.com" });
    const result = await provider.getAllFlags();

    expect(result).toEqual({});
  });
});
