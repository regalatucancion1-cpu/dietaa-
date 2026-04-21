import type { FoodRegistry } from "@/types/nutrition";

/**
 * Registro estático de alimentos con datos nutricionales y precios de Mercadona.
 *
 * - kcalPerUnit: kcal por gramo (g), mililitro (ml) o pieza (piece)
 * - pricePerUnit: € por gramo (g), mililitro (ml) o pieza (piece)
 */
export const FOOD_REGISTRY: FoodRegistry = {
  // ──────────────────────────────────────────────
  // CARBOHIDRATOS (por gramo)
  // ──────────────────────────────────────────────

  avena: {
    name: "Avena",
    kcalPerUnit: 3.6,
    unit: "g",
    pricePerUnit: 0.002,
  },

  "pan-integral-centeno-espelta": {
    name: "Pan integral / centeno / espelta",
    kcalPerUnit: 2.5,
    unit: "g",
    pricePerUnit: 0.004,
  },

  "arroz-basmati-integral-o-pasta-integral": {
    name: "Arroz basmati / integral o pasta integral",
    kcalPerUnit: 3.5,
    unit: "g",
    pricePerUnit: 0.002,
  },

  quinoa: {
    name: "Quinoa",
    kcalPerUnit: 3.7,
    unit: "g",
    pricePerUnit: 0.006,
  },

  "patata-o-boniato": {
    name: "Patata o boniato",
    kcalPerUnit: 0.85,
    unit: "g",
    pricePerUnit: 0.0015,
  },

  "garbanzos-lentejas-alubias": {
    name: "Garbanzos / Lentejas / Alubias",
    kcalPerUnit: 1.2,
    unit: "g",
    pricePerUnit: 0.003,
  },

  noquis: {
    name: "Ñoquis",
    kcalPerUnit: 1.3,
    unit: "g",
    pricePerUnit: 0.002,
  },

  // ──────────────────────────────────────────────
  // CARBOHIDRATOS (por pieza)
  // ──────────────────────────────────────────────

  "wrap-integral": {
    name: "Wrap integral",
    kcalPerUnit: 170,
    unit: "piece",
    pricePerUnit: 0.25,
  },

  "pieza-de-fruta": {
    name: "Pieza de fruta",
    kcalPerUnit: 80,
    unit: "piece",
    pricePerUnit: 0.35,
  },

  platano: {
    name: "Plátano",
    kcalPerUnit: 105,
    unit: "piece",
    pricePerUnit: 0.3,
  },

  manzana: {
    name: "Manzana",
    kcalPerUnit: 80,
    unit: "piece",
    pricePerUnit: 0.35,
  },

  "frutos-rojos-o-arandanos": {
    name: "Frutos rojos o arándanos",
    kcalPerUnit: 0.5,
    unit: "g",
    pricePerUnit: 0.012,
  },

  "frutos-rojos": {
    name: "Frutos rojos",
    kcalPerUnit: 0.5,
    unit: "g",
    pricePerUnit: 0.012,
  },

  // ──────────────────────────────────────────────
  // PROTEÍNAS (por gramo)
  // ──────────────────────────────────────────────

  "pollo-o-pavo": {
    name: "Pollo o pavo",
    kcalPerUnit: 1.1,
    unit: "g",
    pricePerUnit: 0.008,
  },

  "pechuga-de-pollo-o-pavo": {
    name: "Pechuga de pollo o pavo",
    kcalPerUnit: 1.1,
    unit: "g",
    pricePerUnit: 0.008,
  },

  "ternera-magra-o-lomo-de-cerdo": {
    name: "Ternera magra o lomo de cerdo",
    kcalPerUnit: 1.4,
    unit: "g",
    pricePerUnit: 0.012,
  },

  "tofu-firme": {
    name: "Tofu firme",
    kcalPerUnit: 1.4,
    unit: "g",
    pricePerUnit: 0.009,
  },

  "pescado-azul": {
    name: "Pescado azul",
    kcalPerUnit: 2.0,
    unit: "g",
    pricePerUnit: 0.015,
  },

  "pescado-blanco": {
    name: "Pescado blanco",
    kcalPerUnit: 0.85,
    unit: "g",
    pricePerUnit: 0.012,
  },

  "fiambre-de-pavo-o-pollo": {
    name: "Fiambre de pavo o pollo",
    kcalPerUnit: 1.05,
    unit: "g",
    pricePerUnit: 0.01,
  },

  "jamon-serrano": {
    name: "Jamón serrano",
    kcalPerUnit: 2.4,
    unit: "g",
    pricePerUnit: 0.017,
  },

  "proteina-en-polvo": {
    name: "Proteína en polvo",
    kcalPerUnit: 4.0,
    unit: "g",
    pricePerUnit: 0.02,
  },

  "yogur-griego-0-o-qfb-0": {
    name: "Yogur griego 0% o QFB 0%",
    kcalPerUnit: 0.6,
    unit: "g",
    pricePerUnit: 0.004,
  },

  "claras-1-huevo": {
    name: "Claras + 1 huevo",
    kcalPerUnit: 0.55,
    unit: "g",
    pricePerUnit: 0.003,
  },

  "yogur-o-kefir-natural": {
    name: "Yogur o kéfir natural",
    kcalPerUnit: 0.6,
    unit: "g",
    pricePerUnit: 0.003,
  },

  // ──────────────────────────────────────────────
  // GRASAS
  // ──────────────────────────────────────────────

  aove: {
    name: "AOVE",
    kcalPerUnit: 9.0,
    unit: "g",
    pricePerUnit: 0.007,
  },

  aguacate: {
    name: "Aguacate",
    kcalPerUnit: 1.6,
    unit: "g",
    pricePerUnit: 0.005,
  },

  guacamole: {
    name: "Guacamole",
    kcalPerUnit: 1.5,
    unit: "g",
    pricePerUnit: 0.008,
  },

  "crema-cacahuete-o-frutos-secos": {
    name: "Crema cacahuete o frutos secos",
    kcalPerUnit: 6.0,
    unit: "g",
    pricePerUnit: 0.012,
  },

  "crema-de-cacahuete-o-frutos-secos": {
    name: "Crema de cacahuete o frutos secos",
    kcalPerUnit: 6.0,
    unit: "g",
    pricePerUnit: 0.012,
  },

  // ──────────────────────────────────────────────
  // EXTRAS
  // ──────────────────────────────────────────────

  "chocolate-85": {
    name: "Chocolate ≥85%",
    kcalPerUnit: 6.0,
    unit: "g",
    pricePerUnit: 0.024,
  },
};
