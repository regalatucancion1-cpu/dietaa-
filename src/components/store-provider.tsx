"use client";

import { useHydrateStore } from "@/hooks/use-meal-selections";
import { useHydrateGymStore } from "@/hooks/use-gym";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useHydrateStore();
  useHydrateGymStore();
  return <>{children}</>;
}
