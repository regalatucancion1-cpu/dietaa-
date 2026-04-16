import type { FoodRegistry } from "@/types/nutrition";

/**
 * Registro estático de alimentos con datos nutricionales y precios de Mercadona.
 *
 * - kcalPerUnit: kcal por gramo (g), mililitro (ml) o pieza (piece)
 * - pricePerUnit: € por gramo (g), mililitro (ml) o pieza (piece)
 *
 * Precios obtenidos de tienda.mercadona.es (abril 2026).
 * Valores nutricionales por 100g/100ml según información del envase.
 */
export const FOOD_REGISTRY: FoodRegistry = {
  // ──────────────────────────────────────────────
  // CARBOHIDRATOS (por gramo)
  // ──────────────────────────────────────────────

  "cereales-o-avena": {
    name: "Cereales o avena",
    kcalPerUnit: 3.6, // ~360 kcal/100g (copos avena / cereales 0% azúcar)
    unit: "g",
    pricePerUnit: 0.002, // ~2.00 €/kg (copos avena Brüggen 1.69€/kg – Corn Flakes 3.00€/kg)
  },

  "pan": {
    name: "Pan",
    kcalPerUnit: 2.5, // ~250 kcal/100g
    unit: "g",
    pricePerUnit: 0.00183, // Barra de pan tradicional 1.83 €/kg
  },

  "arroz": {
    name: "Arroz",
    kcalPerUnit: 3.5, // ~350 kcal/100g (crudo)
    unit: "g",
    pricePerUnit: 0.0013, // Arroz redondo Hacendado 1.30 €/kg
  },

  "pasta": {
    name: "Pasta",
    kcalPerUnit: 3.5, // ~350 kcal/100g (cruda)
    unit: "g",
    pricePerUnit: 0.0016, // Spaghetti Hacendado 1.60 €/kg
  },

  "legumbres": {
    name: "Legumbres",
    kcalPerUnit: 3.0, // ~300 kcal/100g (crudas)
    unit: "g",
    pricePerUnit: 0.002, // Lentejas/garbanzos Hacendado ~2.00 €/kg
  },

  "gnocchis": {
    name: "Gnocchis",
    kcalPerUnit: 1.3, // ~130 kcal/100g
    unit: "g",
    pricePerUnit: 0.002, // Gnocchi frescos Hacendado 2.00 €/kg
  },

  "patata-o-boniato": {
    name: "Patata o boniato",
    kcalPerUnit: 0.85, // ~85 kcal/100g
    unit: "g",
    pricePerUnit: 0.0015, // ~1.50 €/kg
  },

  // ──────────────────────────────────────────────
  // CARBOHIDRATOS (por pieza)
  // ──────────────────────────────────────────────

  "tortitas-de-arroz/maiz": {
    name: "Tortitas de arroz/maíz",
    kcalPerUnit: 30, // ~30 kcal/tortita (~10g, 350 kcal/100g)
    unit: "piece",
    pricePerUnit: 0.09, // Tortitas Hacendado 1.10€/12 uds ≈ 0.09 €/ud
  },

  "wraps-tipo-burrito": {
    name: "Wraps tipo burrito",
    kcalPerUnit: 186, // ~60g/wrap, ~310 kcal/100g
    unit: "piece",
    pricePerUnit: 0.19, // Tortillas trigo Hacendado 1.15€/6 uds ≈ 0.19 €/ud
  },

  "pieza-de-fruta": {
    name: "Pieza de fruta",
    kcalPerUnit: 80, // ~80 kcal pieza mediana
    unit: "piece",
    pricePerUnit: 0.35, // ~0.35 €/pieza media
  },

  // ──────────────────────────────────────────────
  // PROTEÍNAS – AVES (por gramo)
  // ──────────────────────────────────────────────

  "pechuga-de-pollo": {
    name: "Pechuga de pollo",
    kcalPerUnit: 1.1, // ~110 kcal/100g
    unit: "g",
    pricePerUnit: 0.0073, // Filetes pechuga pollo 7.30 €/kg
  },

  "hamburguesa-de-pollo": {
    name: "Hamburguesa de pollo",
    kcalPerUnit: 1.5, // ~150 kcal/100g (procesada)
    unit: "g",
    pricePerUnit: 0.00732, // Burger de pollo 7.32 €/kg
  },

  "solomillo-de-pollo": {
    name: "Solomillo de pollo",
    kcalPerUnit: 1.1, // ~110 kcal/100g
    unit: "g",
    pricePerUnit: 0.008, // Solomillos de pollo 8.00 €/kg
  },

  "carne-picada-de-pollo": {
    name: "Carne picada de pollo",
    kcalPerUnit: 1.2, // ~120 kcal/100g
    unit: "g",
    pricePerUnit: 0.0073, // ~7.30 €/kg (similar a pechuga)
  },

  "pechuga-de-pavo": {
    name: "Pechuga de pavo",
    kcalPerUnit: 1.05, // ~105 kcal/100g
    unit: "g",
    pricePerUnit: 0.00875, // Filetes pechuga pavo 8.75 €/kg
  },

  // ──────────────────────────────────────────────
  // PROTEÍNAS – CERDO (por gramo)
  // ──────────────────────────────────────────────

  "lomo": {
    name: "Lomo",
    kcalPerUnit: 1.4, // ~140 kcal/100g (lomo de cerdo fresco)
    unit: "g",
    pricePerUnit: 0.008, // ~8.00 €/kg
  },

  "pincho-amarillo-con-perejil": {
    name: "Pincho amarillo con perejil",
    kcalPerUnit: 1.4, // ~140 kcal/100g
    unit: "g",
    pricePerUnit: 0.008, // ~8.00 €/kg
  },

  "pincho-amarillo": {
    name: "Pincho amarillo",
    kcalPerUnit: 1.4, // ~140 kcal/100g
    unit: "g",
    pricePerUnit: 0.008, // ~8.00 €/kg
  },

  // ──────────────────────────────────────────────
  // PROTEÍNAS – VACUNO (por gramo)
  // ──────────────────────────────────────────────

  "filete-de-ternera": {
    name: "Filete de ternera",
    kcalPerUnit: 1.3, // ~130 kcal/100g
    unit: "g",
    pricePerUnit: 0.019, // Filetes vacuno añojo plancha 19.00 €/kg
  },

  "bistec-de-ternera": {
    name: "Bistec de ternera",
    kcalPerUnit: 1.3, // ~130 kcal/100g
    unit: "g",
    pricePerUnit: 0.0185, // Escalopín vacuno añojo 18.50 €/kg
  },

  "hamburguesa-de-ternera": {
    name: "Hamburguesa de ternera",
    kcalPerUnit: 2.2, // ~220 kcal/100g (procesada)
    unit: "g",
    pricePerUnit: 0.01148, // Burger vacuno 11.48 €/kg
  },

  "carne-picada-de-ternera": {
    name: "Carne picada de ternera",
    kcalPerUnit: 1.7, // ~170 kcal/100g
    unit: "g",
    pricePerUnit: 0.011, // Carne picada vacuno 11.00 €/kg
  },

  // ──────────────────────────────────────────────
  // PROTEÍNAS – EMBUTIDO (por gramo)
  // ──────────────────────────────────────────────

  "jamon-york-o-pavo": {
    name: "Jamón york o pavo",
    kcalPerUnit: 1.05, // ~105 kcal/100g
    unit: "g",
    pricePerUnit: 0.00988, // Pechuga pavo Hacendado finas lonchas 9.88 €/kg
  },

  "jamon-serrano": {
    name: "Jamón serrano",
    kcalPerUnit: 2.4, // ~240 kcal/100g
    unit: "g",
    pricePerUnit: 0.01708, // Jamón serrano Incarlopsa lonchas 17.08 €/kg
  },

  "lomo-embuchado": {
    name: "Lomo embuchado",
    kcalPerUnit: 2.5, // ~250 kcal/100g
    unit: "g",
    pricePerUnit: 0.017, // Lomo embuchado Hacendado 17.00 €/kg
  },

  // ──────────────────────────────────────────────
  // PROTEÍNAS – HUEVOS (por pieza)
  // ──────────────────────────────────────────────

  "tortilla-de-huevos": {
    name: "Tortilla de huevos",
    kcalPerUnit: 90, // ~90 kcal/huevo (huevo + aceite)
    unit: "piece",
    pricePerUnit: 0.27, // Huevos L 3.20€/12 ≈ 0.27 €/ud
  },

  "huevos-cocidos": {
    name: "Huevos cocidos",
    kcalPerUnit: 75, // ~75 kcal/huevo cocido
    unit: "piece",
    pricePerUnit: 0.27,
  },

  "huevo-a-la-plancha": {
    name: "Huevo a la plancha",
    kcalPerUnit: 90, // ~90 kcal (huevo + aceite)
    unit: "piece",
    pricePerUnit: 0.27,
  },

  // ──────────────────────────────────────────────
  // PROTEÍNAS – OTROS (ml / pieza)
  // ──────────────────────────────────────────────

  "clara-de-huevo": {
    name: "Clara de huevo",
    kcalPerUnit: 0.48, // ~48 kcal/100ml
    unit: "ml",
    pricePerUnit: 0.0025, // ~2.50 €/L (clara líquida Mercadona)
  },

  "atun-al-natural-lata": {
    name: "Atún al natural (lata)",
    kcalPerUnit: 52, // ~52 kcal/lata (52g escurrido, ~100 kcal/100g)
    unit: "piece",
    pricePerUnit: 0.7, // Atún claro al natural Hacendado 4.20€/6 latas ≈ 0.70 €/lata
  },

  "proteina-en-polvo": {
    name: "Proteína en polvo",
    kcalPerUnit: 4.0, // ~400 kcal/100g (whey protein)
    unit: "g",
    pricePerUnit: 0.02, // ~20.00 €/kg (precio medio whey)
  },

  // ──────────────────────────────────────────────
  // EXTRAS
  // ──────────────────────────────────────────────

  "leche-o-bebida-vegetal": {
    name: "Leche o bebida vegetal",
    kcalPerUnit: 0.45, // ~45 kcal/100ml (semi/avena)
    unit: "ml",
    pricePerUnit: 0.0009, // ~0.90 €/L (leche semi 0.84 / avena 0.95)
  },

  // ──────────────────────────────────────────────
  // ITEMS COMPUESTOS (estimación media por porción)
  // ──────────────────────────────────────────────

  "1/2-aguacate-o-30g-frutos-secos-o-1-huevo-a-la-plancha": {
    name: "½ aguacate o 30g frutos secos o 1 huevo a la plancha",
    kcalPerUnit: 120, // media: aguacate ~120, frutos secos ~180, huevo ~90
    unit: "piece",
    pricePerUnit: 0.5, // estimación media
  },

  "1/2-aguacate-o-30g-frutos-secos": {
    name: "½ aguacate o 30g frutos secos",
    kcalPerUnit: 150, // media: aguacate ~120, frutos secos ~180
    unit: "piece",
    pricePerUnit: 0.5,
  },
};
