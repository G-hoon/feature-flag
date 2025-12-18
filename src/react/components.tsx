import type { ReactNode } from "react";
import { useFeatureFlag } from "./hooks";

interface FeatureProps {
  flag: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * @example
 * <Feature flag="new-checkout" fallback={<OldCheckout />}>
 *   <NewCheckout />
 * </Feature>
 */
export function Feature({ flag, children, fallback = null }: FeatureProps) {
  const isEnabled = useFeatureFlag(flag);

  return <>{isEnabled ? children : fallback}</>;
}
