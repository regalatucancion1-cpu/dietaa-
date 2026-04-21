import { FOOD_REGISTRY } from "@/data/food-registry";
import { toFoodKey, parseQuantity } from "@/lib/food-utils";
import type {
  FoodOption,
  FoodSection,
  Meal,
  MealOption,
  MealSelection,
  MealType,
} from "@/types/diet";
import { DIET_PLAN } from "@/data/diet-plan";
import { MEAL_ORDER } from "@/types/diet";

export interface MealTotals {
  kcal: number;
  price: number;
}

const ZERO: MealTotals = { kcal: 0, price: 0 };

export function calculateFoodItem(food: FoodOption): MealTotals | null {
  const key = toFoodKey(food.name);
  const entry = FOOD_REGISTRY[key];
  if (!entry) return null;

  const parsed = parseQuantity(food.quantity);
  if (!parsed) return ZERO;

  if (parsed.unit !== entry.unit) return null;

  return {
    kcal: Math.round(entry.kcalPerUnit * parsed.value),
    price: Math.round(entry.pricePerUnit * parsed.value * 100) / 100,
  };
}

function sumFoodItems(items: FoodOption[]): MealTotals {
  let kcal = 0;
  let price = 0;
  for (const item of items) {
    const result = calculateFoodItem(item);
    if (result) {
      kcal += result.kcal;
      price += result.price;
    }
  }
  return { kcal, price: Math.round(price * 100) / 100 };
}

function sectionTotals(section: FoodSection | undefined, pickIndex: number): MealTotals {
  if (!section || section.items.length === 0) return ZERO;
  if (section.pick) {
    const item = section.items[pickIndex] ?? section.items[0];
    return item ? calculateFoodItem(item) ?? ZERO : ZERO;
  }
  return sumFoodItems(section.items);
}

export function getActiveVariant(meal: Meal, isTraining: boolean) {
  return isTraining ? meal.training : meal.rest;
}

export function getActiveOption(
  meal: Meal,
  selection: MealSelection,
  isTraining: boolean
): MealOption | null {
  const variant = getActiveVariant(meal, isTraining);
  if (!variant || variant.options.length === 0) return null;
  const id = selection.optionId ?? variant.options[0].id;
  return variant.options.find((o) => o.id === id) ?? variant.options[0];
}

export function calculateMealTotals(
  meal: Meal,
  selection: MealSelection,
  isTraining: boolean
): MealTotals {
  const option = getActiveOption(meal, selection, isTraining);
  if (!option) return ZERO;

  const carbT = sectionTotals(option.carbs, selection.carbIndex ?? 0);
  const protT = sectionTotals(option.protein, selection.proteinIndex ?? 0);
  const fatT = sectionTotals(option.fats, selection.fatIndex ?? 0);
  const extraT = option.extras ? sumFoodItems(option.extras) : ZERO;

  return {
    kcal: carbT.kcal + protT.kcal + fatT.kcal + extraT.kcal,
    price:
      Math.round(
        (carbT.price + protT.price + fatT.price + extraT.price) * 100
      ) / 100,
  };
}

export function calculateDayTotals(
  selections: Record<MealType, MealSelection>,
  isTraining: boolean
): MealTotals {
  let totalKcal = 0;
  let totalPrice = 0;

  for (const mealType of MEAL_ORDER) {
    const meal = DIET_PLAN[mealType];
    if (!meal) continue;
    const variant = getActiveVariant(meal, isTraining);
    if (!variant) continue;
    const selection = selections[mealType] ?? {};
    const totals = calculateMealTotals(meal, selection, isTraining);
    totalKcal += totals.kcal;
    totalPrice += totals.price;
  }

  return { kcal: totalKcal, price: Math.round(totalPrice * 100) / 100 };
}
