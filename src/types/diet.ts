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
  | "comida"
  | "pre_entreno"
  | "merienda"
  | "cena";

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  color: string;
}

export interface FoodOption {
  name: string;
  quantity: string;
  quantityCooked?: string;
}

export interface FoodSection {
  pick?: boolean;
  items: FoodOption[];
}

export interface MealOption {
  id: string;
  label: string;
  carbs: FoodSection;
  protein: FoodSection;
  fats?: FoodSection;
  vegetables?: FoodOption[];
  dessert?: FoodOption[];
  extras?: FoodOption[];
  notes?: string;
}

export interface MealVariant {
  options: MealOption[];
  note?: string;
}

export interface Meal {
  type: MealType;
  label: string;
  supplements: Supplement[];
  training?: MealVariant;
  rest?: MealVariant;
  optionalNote?: string;
}

export interface MealSelection {
  optionId?: string;
  carbIndex?: number;
  proteinIndex?: number;
  fatIndex?: number;
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
  comida: "Comida",
  pre_entreno: "Pre-entreno",
  merienda: "Merienda",
  cena: "Cena",
};

export const MEAL_ORDER: MealType[] = [
  "desayuno",
  "comida",
  "pre_entreno",
  "merienda",
  "cena",
];
