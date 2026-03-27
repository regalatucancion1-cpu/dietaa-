import type { DayOfWeek, MealType } from "@/types/diet";

const JS_DAY_TO_DIET: Record<number, DayOfWeek> = {
  1: "lunes",
  2: "martes",
  3: "miercoles",
  4: "jueves",
  5: "viernes",
  6: "sabado",
  0: "domingo",
};

export function getCurrentDay(): DayOfWeek {
  return JS_DAY_TO_DIET[new Date().getDay()];
}

// Meal time ranges (hour boundaries)
const MEAL_TIMES: { type: MealType; start: number; end: number; label: string }[] = [
  { type: "desayuno", start: 7, end: 9.5, label: "8:00 - 9:30" },
  { type: "media_manana", start: 9.5, end: 12, label: "10:00 - 12:00" },
  { type: "comida", start: 12, end: 15.5, label: "13:00 - 15:30" },
  { type: "merienda", start: 15.5, end: 19, label: "17:00 - 19:00" },
  { type: "cena", start: 19, end: 23, label: "21:00 - 23:00" },
];

export function getCurrentMeal(): MealType | null {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;

  for (const meal of MEAL_TIMES) {
    if (hour >= meal.start && hour < meal.end) {
      return meal.type;
    }
  }
  return null;
}

export function getNextMeal(): MealType {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;

  for (const meal of MEAL_TIMES) {
    if (hour < meal.end) {
      return meal.type;
    }
  }
  return "desayuno"; // after cena, next is desayuno
}

export function getMealTimeLabel(mealType: MealType): string {
  return MEAL_TIMES.find((m) => m.type === mealType)?.label ?? "";
}

export function isMealPast(mealType: MealType): boolean {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  const meal = MEAL_TIMES.find((m) => m.type === mealType);
  return meal ? hour >= meal.end : false;
}

export function isMealCurrent(mealType: MealType): boolean {
  return getCurrentMeal() === mealType;
}

export function isMealUpcoming(mealType: MealType): boolean {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  const meal = MEAL_TIMES.find((m) => m.type === mealType);
  return meal ? hour < meal.start : false;
}
