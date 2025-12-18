import { StaticProvider, FeatureFlagClient } from "../src";

async function main() {
  console.log("=== FeatureFlagClient 테스트 ===");

  const provider = new StaticProvider({
    "feature-a": { enabled: true },
    "feature-b": { enabled: false },
    "feature-c": { enabled: true, metadata: { version: 2 } },
  });

  const client = new FeatureFlagClient({
    provider,
    defaultValue: false,
  });

  // 초기화
  console.log("--- 초기화 ---");
  await client.init();
  console.log("isInitialized:", client.isInitialized()); // true

  // 조회 테스트
  console.log("--- 조회 ---");
  console.log("feature-a:", client.isEnabled("feature-a")); // true
  console.log("feature-b:", client.isEnabled("feature-b")); // false
  console.log("unknown:", client.isEnabled("unknown")); // false (defaultValue)

  // getFlag 테스트
  console.log("--- getFlag ---");
  console.log("feature-a:", client.getFlag("feature-a"));
  console.log("unknown:", client.getFlag("unknown")); // null

  // getAllFlags 테스트
  console.log("--- getAllFlags ---");
  console.log(client.getAllFlags());

  // refresh 테스트
  console.log("--- refresh 테스트 ---");
  provider.setFlag("dark-mode", { enabled: true });
  console.log("변경 전:", client.isEnabled("dark-mode")); // false (캐시)
  await client.refresh();
  console.log("refresh 후:", client.isEnabled("dark-mode")); // true

  console.log("✅ Client 테스트 완료!");
}

main().catch(console.error);
