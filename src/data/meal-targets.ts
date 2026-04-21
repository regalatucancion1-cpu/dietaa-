import type { MealType } from "@/types/diet";

export interface MealTarget {
  min: number;
  max: number;
}

/**
 * Rangos objetivo de kcal por comida, derivados de la pauta de Christian.
 *
 * Días de entreno (~2300 kcal totales):
 *   desayuno 750–850 · comida 650–750 · pre-entreno 300–400 · cena 400–500
 *
 * Días de descanso (~2150 kcal totales):
 *   desayuno 700–800 · comida 550–650 · merienda 200–300 · cena 550–650
 *
 * `null` significa que la comida no aplica en ese tipo de día.
 */
export const MEAL_TARGETS: {
  training: Record<MealType, MealTarget | null>;
  rest: Record<MealType, MealTarget | null>;
} = {
  training: {
    desayuno: { min: 750, max: 850 },
    comida: { min: 650, max: 750 },
    pre_entreno: { min: 300, max: 400 },
    merienda: null,
    cena: { min: 400, max: 500 },
  },
  rest: {
    desayuno: { min: 700, max: 800 },
    comida: { min: 550, max: 650 },
    pre_entreno: null,
    merienda: { min: 200, max: 300 },
    cena: { min: 550, max: 650 },
  },
};

export const DAILY_TARGETS = {
  training: 2300,
  rest: 2150,
};

export function targetFor(
  mealType: MealType,
  dayType: "training" | "rest"
): MealTarget | null {
  return MEAL_TARGETS[dayType][mealType];
}

/**
 * Clasifica un valor de kcal contra el rango objetivo.
 * `under` si está ≥10% por debajo del min, `over` si ≥10% por encima del max.
 */
export function kcalFit(
  kcal: number,
  target: MealTarget
): "under" | "ok" | "over" {
  if (kcal < target.min * 0.9) return "under";
  if (kcal > target.max * 1.1) return "over";
  return "ok";
}
