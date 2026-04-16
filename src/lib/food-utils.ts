export interface ParsedQuantity {
  value: number;
  unit: "g" | "ml" | "piece";
}

/**
 * Normaliza un nombre de alimento a un slug para usar como clave del registry.
 * Ej: "Pechuga de pollo" → "pechuga-de-pollo"
 */
export function toFoodKey(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .replace(/[½¼¾]/g, "") // quitar fracciones unicode
    .replace(/[()]/g, "") // quitar paréntesis
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Parsea un string de cantidad del plan nutricional.
 * Devuelve null para cantidades no calculables ("libre", vacío).
 *
 * Ejemplos:
 *   "75g"        → { value: 75, unit: "g" }
 *   "250ml"      → { value: 250, unit: "ml" }
 *   "250-300ml"  → { value: 275, unit: "ml" }
 *   "4 uds"      → { value: 4, unit: "piece" }
 *   "2 huevos"   → { value: 2, unit: "piece" }
 *   "1 lata"     → { value: 1, unit: "piece" }
 *   "1 pieza"    → { value: 1, unit: "piece" }
 *   "libre"      → null
 *   ""           → null
 */
export function parseQuantity(qty: string): ParsedQuantity | null {
  const trimmed = qty.trim();
  if (!trimmed || trimmed === "libre") return null;

  // Rango: "250-300ml"
  const rangeMatch = trimmed.match(
    /^(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)\s*(g|ml)\b/i
  );
  if (rangeMatch) {
    const low = parseFloat(rangeMatch[1].replace(",", "."));
    const high = parseFloat(rangeMatch[2].replace(",", "."));
    const unit = rangeMatch[3].toLowerCase() as "g" | "ml";
    return { value: (low + high) / 2, unit };
  }

  // Gramos o mililitros: "75g", "250ml"
  const gmMatch = trimmed.match(/^(\d+(?:[.,]\d+)?)\s*(g|ml)\b/i);
  if (gmMatch) {
    const value = parseFloat(gmMatch[1].replace(",", "."));
    const unit = gmMatch[2].toLowerCase() as "g" | "ml";
    return { value, unit };
  }

  // Piezas: "4 uds", "2 huevos", "1 huevo", "1 lata", "1 pieza"
  const pieceMatch = trimmed.match(
    /^(\d+(?:[.,]\d+)?)\s*(uds?|huevos?|latas?|piezas?)\b/i
  );
  if (pieceMatch) {
    const value = parseFloat(pieceMatch[1].replace(",", "."));
    return { value, unit: "piece" };
  }

  return null;
}
