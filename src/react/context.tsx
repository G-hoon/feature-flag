import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { FeatureFlagClient } from "../core/client";

interface FeatureFlagContextValue {
  client: FeatureFlagClient;
  isReady: boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

interface FeatureFlagProviderProps {
  client: FeatureFlagClient;
  children: ReactNode;
}

export function FeatureFlagProvider({
  client,
  children,
}: FeatureFlagProviderProps) {
  const [isReady, setIsReady] = useState(client.isInitialized());

  useEffect(() => {
    if (!client.isInitialized()) {
      client.init().then(() => setIsReady(true));
    }
  }, [client]);

  return (
    <FeatureFlagContext.Provider value={{ client, isReady }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlagContext(): FeatureFlagContextValue {
  const context = useContext(FeatureFlagContext);

  if (!context) {
    throw new Error(
      "useFeatureFlagContext must be used within FeatureFlagProvider"
    );
  }

  return context;
}
