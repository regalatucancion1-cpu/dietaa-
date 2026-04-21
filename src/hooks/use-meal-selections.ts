"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DayOfWeek, MealType, MealSelection } from "@/types/diet";

interface MealStore {
  trainingDays: Record<DayOfWeek, boolean>;
  selections: Record<DayOfWeek, Record<MealType, MealSelection>>;
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
  fatIndex: 0,
};

const defaultDaySelections: Record<MealType, MealSelection> = {
  desayuno: { ...defaultSelection, optionId: "desayuno-dulce" },
  comida: { ...defaultSelection, optionId: "comida-unica" },
  pre_entreno: { ...defaultSelection, optionId: "pre-unica" },
  merienda: { ...defaultSelection, optionId: "merienda-dulce" },
  cena: { ...defaultSelection, optionId: "cena-unica" },
};

function initialSelections() {
  return Object.fromEntries(
    days.map((d) => [
      d,
      Object.fromEntries(
        Object.entries(defaultDaySelections).map(([k, v]) => [k, { ...v }])
      ),
    ])
  ) as Record<DayOfWeek, Record<MealType, MealSelection>>;
}

export const useMealStore = create<MealStore>()(
  persist(
    (set) => ({
      trainingDays: Object.fromEntries(
        days.map((d) => [d, d !== "domingo"])
      ) as Record<DayOfWeek, boolean>,
      selections: initialSelections(),
      toggleTrainingDay: (day) =>
        set((state) => ({
          trainingDays: {
            ...state.trainingDays,
            [day]: !state.trainingDays[day],
          },
        })),
      setSelection: (day, meal, selection) =>
        set((state) => ({
          selections: {
            ...state.selections,
            [day]: {
              ...state.selections[day],
              [meal]: selection,
            },
          },
        })),
    }),
    {
      name: "dieta-christian-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

export function useHydrateStore() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    useMealStore.persist.rehydrate();
    setHydrated(true);
  }, []);
  return hydrated;
}

export function useTrainingDays() {
  return useMealStore((s) => s.trainingDays);
}

export function useSelections() {
  return useMealStore((s) => s.selections);
}

export function useToggleTrainingDay() {
  return useMealStore((s) => s.toggleTrainingDay);
}

export function useSetSelection() {
  return useMealStore((s) => s.setSelection);
}
