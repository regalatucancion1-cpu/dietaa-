"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DayOfWeek, MealType, MealSelection } from "@/types/diet";

export type Profile = "dani" | "nil";

interface ProfileData {
  trainingDays: Record<DayOfWeek, boolean>;
  selections: Record<DayOfWeek, Record<MealType, MealSelection>>;
}

interface MealStore {
  activeProfile: Profile;
  profiles: Record<Profile, ProfileData>;
  setProfile: (profile: Profile) => void;
  toggleTrainingDay: (day: DayOfWeek) => void;
  setSelection: (
    day: DayOfWeek,
    meal: MealType,
    selection: MealSelection
  ) => void;
}

const days: DayOfWeek[] = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

const defaultSelection: MealSelection = {
  optionId: undefined,
  carbIndex: 0,
  proteinIndex: 0,
};

const defaultDaySelections: Record<MealType, MealSelection> = {
  desayuno: { ...defaultSelection, optionId: "desayuno-a" },
  media_manana: { ...defaultSelection, optionId: "media-a" },
  comida: { ...defaultSelection },
  merienda: { ...defaultSelection, optionId: "merienda-a" },
  cena: { ...defaultSelection },
};

function createProfileData(): ProfileData {
  return {
    trainingDays: Object.fromEntries(
      days.map((d) => [d, true])
    ) as Record<DayOfWeek, boolean>,
    selections: Object.fromEntries(
      days.map((d) => [
        d,
        Object.fromEntries(
          Object.entries(defaultDaySelections).map(([k, v]) => [k, { ...v }])
        ),
      ])
    ) as Record<DayOfWeek, Record<MealType, MealSelection>>,
  };
}

export const useMealStore = create<MealStore>()(
  persist(
    (set) => ({
      activeProfile: "dani" as Profile,
      profiles: {
        dani: createProfileData(),
        nil: createProfileData(),
      },
      setProfile: (profile) => set({ activeProfile: profile }),
      toggleTrainingDay: (day) =>
        set((state) => {
          const p = state.activeProfile;
          return {
            profiles: {
              ...state.profiles,
              [p]: {
                ...state.profiles[p],
                trainingDays: {
                  ...state.profiles[p].trainingDays,
                  [day]: !state.profiles[p].trainingDays[day],
                },
              },
            },
          };
        }),
      setSelection: (day, meal, selection) =>
        set((state) => {
          const p = state.activeProfile;
          return {
            profiles: {
              ...state.profiles,
              [p]: {
                ...state.profiles[p],
                selections: {
                  ...state.profiles[p].selections,
                  [day]: {
                    ...state.profiles[p].selections[day],
                    [meal]: selection,
                  },
                },
              },
            },
          };
        }),
    }),
    {
      name: "dieta-selections-v2",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

// Hook to hydrate the store on mount (client-only)
export function useHydrateStore() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    useMealStore.persist.rehydrate();
    setHydrated(true);
  }, []);
  return hydrated;
}

// Stable selectors
export function useTrainingDays() {
  return useMealStore(
    (s) => s.profiles[s.activeProfile].trainingDays
  );
}

export function useSelections() {
  return useMealStore(
    (s) => s.profiles[s.activeProfile].selections
  );
}

export function useToggleTrainingDay() {
  return useMealStore((s) => s.toggleTrainingDay);
}

export function useSetSelection() {
  return useMealStore((s) => s.setSelection);
}
