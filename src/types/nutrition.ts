export interface FoodNutritionEntry {
  /** Nombre del alimento para verificación */
  name: string;
  /** kcal por unidad base (gramo, ml, o pieza) */
  kcalPerUnit: number;
  /** Tipo de unidad base */
  unit: "g" | "ml" | "piece";
  /** Precio en € por unidad base (gramo, ml, o pieza) */
  pricePerUnit: number;
}

export type FoodRegistry = Record<string, FoodNutritionEntry>;
