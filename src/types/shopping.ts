import type { MercadonaProduct } from "./mercadona";

export interface ShoppingItem {
  ingredientName: string;
  totalQuantity: number;
  unit: string;
  category: string;
  matchedProduct?: MercadonaProduct;
  checked: boolean;
}

export interface ShoppingList {
  items: ShoppingItem[];
  estimatedTotal: number;
  generatedAt: string;
}
