import {
  StaticProvider,
  FeatureFlagClient,
  ABTestProvider,
  ABTestSDK,
} from "../src";

async function testWithStaticProvider() {
  console.log("=== StaticProvider 테스트 ===");

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
  console.log("초기화 완료:", client.isInitialized());

  // 조회 테스트
  console.log("--- 플래그 조회 ---");
  console.log("feature-a 활성화 여부:", client.isEnabled("feature-a"));
  console.log("feature-b 활성화 여부:", client.isEnabled("feature-b"));
  console.log("존재하지 않는 플래그:", client.isEnabled("unknown"));

  // getFlag 테스트
  console.log("--- 플래그 상세 정보 ---");
  console.log("feature-c:", client.getFlag("feature-c"));

  // refresh 테스트
  console.log("--- 플래그 변경 후 새로고침 ---");
  provider.setFlag("feature-b", { enabled: true });
  console.log("새로고침 전:", client.isEnabled("feature-b"));
  await client.refresh();
  console.log("새로고침 후:", client.isEnabled("feature-b"));
}

async function testWithABTestProvider() {
  console.log("=== ABTestProvider 테스트 ===");

  /**
   * A/B 테스트 시나리오:
   *
   * 쇼핑몰에서 "구매 버튼 색상" 실험을 진행 중
   * - old: 기존 회색 버튼
   * - new: 새로운 빨간색 버튼
   *
   * 사용자마다 랜덤하게 그룹이 배정됨
   * SDK가 현재 사용자의 그룹을 알려줌
   */
  const mockSDK: ABTestSDK = {
    async getVariant(key: string) {
      const experimentalUserGroup: Record<string, string> = {
        "button-test": "new",
        "proudct-layout-test": "old",
      };
      return experimentalUserGroup[key] ?? null;
    },
    async getAllVariants() {
      return {
        "button-test": "new",
        "proudct-layout-test": "old",
      };
    },
  };

  const provider = new ABTestProvider({
    sdk: mockSDK,
    treatmentValue: "new",
  });

  const client = new FeatureFlagClient({ provider });

  await client.init();

  console.log("--- 현재 사용자의 실험 배정 결과 ---");

  // 구매버튼 색상 실험
  const redButtonVisible = client.isEnabled("button-test");
  console.log("구매버튼 색상 실험:");
  console.log("  - 새 버전 노출 여부:", redButtonVisible);
  console.log("  - 상세:", client.getFlag("button-test"));
  console.log(
    redButtonVisible
      ? "  → 빨간색 구매 버튼을 보여줍니다"
      : "  → 기존 회색 버튼을 보여줍니다"
  );

  console.log("");

  // 상품목록 레이아웃 실험
  const newProductLayoutVisible = client.isEnabled("proudct-layout-test");
  console.log("상품목록 레이아웃 실험:");
  console.log("  - 새 버전 노출 여부:", newProductLayoutVisible);
  console.log("  - 상세:", client.getFlag("proudct-layout-test"));
  console.log(
    newProductLayoutVisible
      ? "  → 새로운 그리드 레이아웃을 보여줍니다"
      : "  → 기존 리스트 레이아웃을 보여줍니다"
  );
}

async function main() {
  await testWithStaticProvider();
  console.log("");
  await testWithABTestProvider();
  console.log("✅ 모든 테스트 완료!");
}

main().catch(console.error);
