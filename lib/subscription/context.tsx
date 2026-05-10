'use client';

import { createContext, useContext } from 'react';
import type { Tier } from '@/lib/subscription/gate';

interface SubscriptionContextValue {
  tier: Tier;
  isFullOrSchool: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
  tier: 'free',
  isFullOrSchool: false,
});

export function SubscriptionProvider({
  tier,
  children,
}: {
  tier: Tier;
  children: React.ReactNode;
}) {
  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        isFullOrSchool: tier === 'full' || tier === 'school',
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionContextValue {
  return useContext(SubscriptionContext);
}
