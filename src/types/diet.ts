export type DayOfWeek =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";

export type MealType =
  | "desayuno"
  | "media_manana"
  | "comida"
  | "merienda"
  | "cena";

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  color: string; // tailwind color class
}

export interface FoodOption {
  name: string;
  quantity: string;
  quantityCooked?: string;
}

export interface ProteinChoice {
  options: FoodOption[];
}

export interface MealOption {
  id: string;
  label: string;
  carbs: FoodOption[];
  protein: ProteinChoice;
  extras?: FoodOption[];
  notes?: string;
}

// Comidas fijas (desayuno, media_manana, merienda) — mismas cada día
export interface FixedMeal {
  type: MealType;
  label: string;
  supplements: Supplement[];
  options: MealOption[];
  nonTrainingOverride?: MealOption; // solo para media_manana
  optionalNote?: string;
}

// Comidas que varían por día (comida, cena)
export interface DailyMealEntry {
  day: DayOfWeek;
  carbOptions: FoodOption[];
  proteinOptions: ProteinChoice[];
  extras?: FoodOption[];
  notes?: string;
}

export interface VariableMeal {
  type: MealType;
  label: string;
  supplements: Supplement[];
  days: DailyMealEntry[];
}

export type Meal = FixedMeal | VariableMeal;

export function isFixedMeal(meal: Meal): meal is FixedMeal {
  return "options" in meal;
}

export function isVariableMeal(meal: Meal): meal is VariableMeal {
  return "days" in meal;
}

// Selecciones del usuario
export interface MealSelection {
  optionId?: string; // para comidas fijas
  carbIndex?: number; // índice de carb elegido
  proteinIndex?: number; // índice de grupo de proteína elegido
  proteinSubIndex?: number; // índice de proteína específica dentro del grupo
}

export interface DaySelections {
  isTrainingDay: boolean;
  meals: Record<MealType, MealSelection>;
}

export const DAYS: DayOfWeek[] = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

export const MEAL_LABELS: Record<MealType, string> = {
  desayuno: "Desayuno",
  media_manana: "Media Mañana",
  comida: "Comida",
  merienda: "Merienda",
  cena: "Cena",
};

export const MEAL_ORDER: MealType[] = [
  "desayuno",
  "media_manana",
  "comida",
  "merienda",
  "cena",
];
