# feature-flag

TypeScript 기반 Feature Flag 라이브러리

## 요구사항

- Node.js 18+
- React 18+ (React 바인딩 사용 시)

## 설치

```bash
pnpm add feature-flag
```

## 개발

```bash
# 빌드
pnpm build

# 테스트
pnpm test

# 테스트 (watch 모드 없이)
pnpm test:run
```

## 사용법

### 기본 사용

```typescript
import { FeatureFlagClient, StaticProvider } from "feature-flag";

const client = new FeatureFlagClient({
  provider: new StaticProvider({
    "new-checkout": { enabled: true },
    "dark-mode": { enabled: false },
  }),
});

await client.init();

if (client.isEnabled("new-checkout")) {
  // 새 체크아웃 로직
}
```

### React에서 사용

```tsx
import {
  FeatureFlagClient,
  StaticProvider,
  FeatureFlagProvider,
  useFeatureFlag,
  Feature,
} from "feature-flag";

const client = new FeatureFlagClient({
  provider: new StaticProvider({
    "new-checkout": { enabled: true },
  }),
});

function App() {
  return (
    <FeatureFlagProvider client={client}>
      <Main />
    </FeatureFlagProvider>
  );
}

// Hook 사용
function Main() {
  const isNewCheckout = useFeatureFlag("new-checkout");
  return <div>{isNewCheckout ? "새 버전" : "기존 버전"}</div>;
}

// 컴포넌트 사용
function Checkout() {
  return (
    <Feature flag="new-checkout" fallback={<OldCheckout />}>
      <NewCheckout />
    </Feature>
  );
}
```

## Provider 종류

### StaticProvider

정적 플래그 정의. 로컬 개발/테스트용.

```typescript
const provider = new StaticProvider({
  "feature-a": { enabled: true },
  "feature-b": { enabled: false, metadata: { version: 2 } },
});
```

### APIProvider

서버에서 플래그를 가져옴.

```typescript
const provider = new APIProvider({
  baseUrl: "https://api.example.com",
  headers: { Authorization: "Bearer token" },
});
```

### ABTestProvider

A/B 테스트 SDK 연동.

```typescript
const provider = new ABTestProvider({
  sdk: myABTestSDK,
  someValue: "new", // 'new'면 enabled: true
});
```

## API

### FeatureFlagClient

| 메서드           | 설명               |
| ---------------- | ------------------ |
| `init()`         | 초기화 (비동기)    |
| `isEnabled(key)` | 플래그 활성화 여부 |
| `getFlag(key)`   | 플래그 상세 정보   |
| `getAllFlags()`  | 모든 플래그 조회   |
| `refresh()`      | 캐시 새로고침      |

### React Hooks

| Hook                        | 설명               |
| --------------------------- | ------------------ |
| `useFeatureFlag(key)`       | 플래그 활성화 여부 |
| `useFeatureFlagConfig(key)` | 플래그 상세 정보   |
| `useAllFeatureFlags()`      | 모든 플래그        |
| `useFeatureFlagReady()`     | 초기화 완료 여부   |
