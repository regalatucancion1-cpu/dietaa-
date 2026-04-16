import { FOOD_REGISTRY } from "@/data/food-registry";
import { toFoodKey, parseQuantity } from "@/lib/food-utils";
import type {
  FoodOption,
  FixedMeal,
  VariableMeal,
  DayOfWeek,
  MealSelection,
  MealType,
} from "@/types/diet";
import { DIET_PLAN } from "@/data/diet-plan";
import { isFixedMeal, MEAL_ORDER } from "@/types/diet";

export interface MealTotals {
  kcal: number;
  price: number;
}

/**
 * Calcula kcal y precio de un alimento individual.
 * Devuelve null si no se puede calcular (cantidad "libre", item no encontrado, etc.)
 */
export function calculateFoodItem(food: FoodOption): MealTotals | null {
  const key = toFoodKey(food.name);
  const entry = FOOD_REGISTRY[key];
  if (!entry) return null;

  const parsed = parseQuantity(food.quantity);
  if (!parsed) {
    // Items con "libre" o sin cantidad → 0
    return { kcal: 0, price: 0 };
  }

  // Verificar compatibilidad de unidades
  if (parsed.unit !== entry.unit) {
    return null;
  }

  return {
    kcal: Math.round(entry.kcalPerUnit * parsed.value),
    price: Math.round(entry.pricePerUnit * parsed.value * 100) / 100,
  };
}

/**
 * Suma los totales de una lista de alimentos.
 */
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

/**
 * Calcula totales para una comida fija (desayuno, media mañana, merienda).
 */
export function calculateFixedMealTotals(
  meal: FixedMeal,
  selection: MealSelection,
  isTraining: boolean
): MealTotals {
  const showNonTraining =
    !isTraining && meal.type === "media_manana" && meal.nonTrainingOverride;
  const activeOptions = showNonTraining
    ? [meal.nonTrainingOverride!]
    : meal.options;

  const selectedId = selection.optionId || activeOptions[0]?.id;
  const option = activeOptions.find((o) => o.id === selectedId) || activeOptions[0];
  if (!option) return { kcal: 0, price: 0 };

  // Sumar carbohidratos (primera opción - en fijas son todos a la vez)
  const carbTotals = sumFoodItems(option.carbs);

  // Sumar proteína seleccionada
  const proteinSubIndex = selection.proteinSubIndex ?? 0;
  const proteinOption = option.protein.options[proteinSubIndex] || option.protein.options[0];
  const proteinTotals = proteinOption
    ? calculateFoodItem(proteinOption) || { kcal: 0, price: 0 }
    : { kcal: 0, price: 0 };

  // Sumar extras
  const extrasTotals = option.extras ? sumFoodItems(option.extras) : { kcal: 0, price: 0 };

  return {
    kcal: carbTotals.kcal + proteinTotals.kcal + extrasTotals.kcal,
    price: Math.round((carbTotals.price + proteinTotals.price + extrasTotals.price) * 100) / 100,
  };
}

/**
 * Calcula totales para una comida variable (comida, cena).
 */
export function calculateVariableMealTotals(
  meal: VariableMeal,
  day: DayOfWeek,
  selection: MealSelection
): MealTotals {
  const dayData = meal.days.find((d) => d.day === day);
  if (!dayData) return { kcal: 0, price: 0 };

  const carbIndex = selection.carbIndex ?? 0;
  const proteinIndex = selection.proteinIndex ?? 0;

  // Carbohidrato seleccionado
  const selectedCarb = dayData.carbOptions[carbIndex] || dayData.carbOptions[0];
  const carbTotals = selectedCarb
    ? calculateFoodItem(selectedCarb) || { kcal: 0, price: 0 }
    : { kcal: 0, price: 0 };

  // Proteína seleccionada (específica dentro del grupo)
  const proteinSubIndex = selection.proteinSubIndex ?? 0;
  const proteinGroup = dayData.proteinOptions[proteinIndex] || dayData.proteinOptions[0];
  const proteinOption = proteinGroup?.options[proteinSubIndex] || proteinGroup?.options[0];
  const proteinTotals = proteinOption
    ? calculateFoodItem(proteinOption) || { kcal: 0, price: 0 }
    : { kcal: 0, price: 0 };

  // Extras
  const extrasTotals = dayData.extras ? sumFoodItems(dayData.extras) : { kcal: 0, price: 0 };

  return {
    kcal: carbTotals.kcal + proteinTotals.kcal + extrasTotals.kcal,
    price: Math.round((carbTotals.price + proteinTotals.price + extrasTotals.price) * 100) / 100,
  };
}

/**
 * Calcula totales del día completo (5 comidas).
 */
export function calculateDayTotals(
  day: DayOfWeek,
  selections: Record<MealType, MealSelection>,
  isTraining: boolean
): MealTotals {
  let totalKcal = 0;
  let totalPrice = 0;

  for (const mealType of MEAL_ORDER) {
    const selection = selections[mealType] || {};
    let meal;

    if (mealType in DIET_PLAN.fixed) {
      meal = DIET_PLAN.fixed[mealType as keyof typeof DIET_PLAN.fixed];
    } else {
      meal = DIET_PLAN.variable[mealType as keyof typeof DIET_PLAN.variable];
    }

    let totals: MealTotals;
    if (isFixedMeal(meal)) {
      totals = calculateFixedMealTotals(meal, selection, isTraining);
    } else {
      totals = calculateVariableMealTotals(meal, day, selection);
    }

    totalKcal += totals.kcal;
    totalPrice += totals.price;
  }

  return {
    kcal: totalKcal,
    price: Math.round(totalPrice * 100) / 100,
  };
}
