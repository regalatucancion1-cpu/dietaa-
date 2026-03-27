"use client";

import { useHydrateStore } from "@/hooks/use-meal-selections";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useHydrateStore();
  return <>{children}</>;
}
