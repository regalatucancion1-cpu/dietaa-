import type { Meal, MealOption } from "@/types/diet";
import { SUPLEMENTOS } from "./supplements";

const VERDURAS_LIBRES = [
  {
    name: "Verduras libres",
    quantity: "libre",
    quantityCooked:
      "espinacas, canónigos, vainas, berenjena, calabacín, brócoli, acelgas, champiñones, espárragos verdes, alcachofas, pimientos",
  },
];

const POSTRE_CENA = [
  { name: "Yogur o kéfir natural", quantity: "150g" },
  { name: "Frutos rojos", quantity: "libre" },
  { name: "Chocolate ≥85%", quantity: "15g" },
];

const GRASAS_COMIDA = {
  pick: true,
  items: [
    { name: "AOVE", quantity: "15g" },
    { name: "Aguacate", quantity: "70g" },
    { name: "Guacamole", quantity: "90g" },
  ],
};

const GRASAS_CENA_REST = {
  pick: true,
  items: [
    { name: "AOVE", quantity: "15g" },
    { name: "Aguacate", quantity: "60g" },
    { name: "Guacamole", quantity: "80g" },
  ],
};

const PROTEINAS_COMIDA = {
  pick: true,
  items: [
    { name: "Pollo o pavo", quantity: "180g" },
    { name: "Ternera magra o lomo de cerdo", quantity: "160g" },
    { name: "Tofu firme", quantity: "200g" },
  ],
};

const PROTEINAS_CENA = {
  pick: true,
  items: [
    { name: "Pechuga de pollo o pavo", quantity: "150g" },
    {
      name: "Pescado azul",
      quantity: "180g",
      quantityCooked: "salmón, atún, sardinas",
    },
    {
      name: "Pescado blanco",
      quantity: "200g",
      quantityCooked: "merluza, bacalao, rape",
    },
  ],
};

const makeComidaOption = (
  carbs: Array<{ name: string; quantity: string; quantityCooked?: string }>
): MealOption => ({
  id: "comida-unica",
  label: "Opción única",
  carbs: { pick: true, items: carbs },
  protein: PROTEINAS_COMIDA,
  fats: GRASAS_COMIDA,
  vegetables: VERDURAS_LIBRES,
  dessert: [{ name: "Pieza de fruta", quantity: "1 pieza" }],
  notes: "Si usas tofu, reduce 10g de grasas",
});

const makeCenaOption = (
  carbs: Array<{ name: string; quantity: string; quantityCooked?: string }>,
  fats: { pick: boolean; items: Array<{ name: string; quantity: string }> }
): MealOption => ({
  id: "cena-unica",
  label: "Opción única",
  carbs: { pick: true, items: carbs },
  protein: PROTEINAS_CENA,
  fats,
  vegetables: VERDURAS_LIBRES,
  dessert: POSTRE_CENA,
  notes: "Si usas pescado azul, reduce 5–10g de grasa",
});

export const desayuno: Meal = {
  type: "desayuno",
  label: "Desayuno",
  supplements: [SUPLEMENTOS.vitaminaD],
  training: {
    options: [
      {
        id: "desayuno-dulce",
        label: "A — Dulce",
        carbs: {
          items: [
            { name: "Avena", quantity: "80g" },
            { name: "Pieza de fruta", quantity: "1 pieza" },
          ],
        },
        protein: {
          pick: true,
          items: [
            { name: "Proteína en polvo", quantity: "35g" },
            { name: "Yogur griego 0% o QFB 0%", quantity: "300g" },
            { name: "Claras + 1 huevo", quantity: "300g" },
          ],
        },
        fats: {
          pick: true,
          items: [
            {
              name: "Ya incluidas en el huevo",
              quantity: "",
            },
            {
              name: "Crema cacahuete o frutos secos",
              quantity: "10g",
              quantityCooked: "solo si usas claras sin huevo",
            },
          ],
        },
      },
      {
        id: "desayuno-salado",
        label: "B — Salado",
        carbs: {
          items: [
            { name: "Pan integral / centeno / espelta", quantity: "80g" },
            { name: "Pieza de fruta", quantity: "1 pieza" },
          ],
        },
        protein: {
          pick: true,
          items: [
            { name: "Fiambre de pavo o pollo", quantity: "120g" },
            { name: "Jamón serrano", quantity: "60g" },
          ],
        },
        fats: {
          pick: true,
          items: [
            { name: "AOVE", quantity: "5g" },
            { name: "Aguacate", quantity: "40g" },
          ],
        },
      },
    ],
  },
  rest: {
    options: [
      {
        id: "desayuno-dulce",
        label: "A — Dulce",
        carbs: {
          items: [
            { name: "Avena", quantity: "60g" },
            { name: "Pieza de fruta", quantity: "1 pieza" },
          ],
        },
        protein: {
          pick: true,
          items: [
            { name: "Proteína en polvo", quantity: "35g" },
            { name: "Yogur griego 0% o QFB 0%", quantity: "250g" },
            { name: "Claras + 1 huevo", quantity: "250g" },
          ],
        },
        fats: {
          pick: true,
          items: [
            { name: "Ya incluidas en el huevo", quantity: "" },
            {
              name: "Crema cacahuete o frutos secos",
              quantity: "10g",
              quantityCooked: "solo si usas claras sin huevo",
            },
          ],
        },
      },
      {
        id: "desayuno-salado",
        label: "B — Salado",
        carbs: {
          items: [
            { name: "Pan integral / centeno / espelta", quantity: "60g" },
            { name: "Pieza de fruta", quantity: "1 pieza" },
          ],
        },
        protein: {
          pick: true,
          items: [
            { name: "Fiambre de pavo o pollo", quantity: "100g" },
            { name: "Jamón serrano", quantity: "50g" },
          ],
        },
        fats: {
          pick: true,
          items: [
            { name: "AOVE", quantity: "5g" },
            { name: "Aguacate", quantity: "40g" },
          ],
        },
      },
    ],
  },
};

export const comida: Meal = {
  type: "comida",
  label: "Comida",
  supplements: [],
  optionalNote: "Postre opcional: 1 fruta si hay hambre",
  training: {
    options: [
      makeComidaOption([
        { name: "Arroz basmati / integral o pasta integral", quantity: "100g" },
        { name: "Quinoa", quantity: "100g" },
        { name: "Patata o boniato", quantity: "350g" },
        {
          name: "Garbanzos / Lentejas / Alubias",
          quantity: "200g",
          quantityCooked: "ya cocidas",
        },
      ]),
    ],
  },
  rest: {
    options: [
      makeComidaOption([
        { name: "Patata o boniato", quantity: "300g" },
        {
          name: "Garbanzos / Lentejas / Alubias",
          quantity: "150g",
          quantityCooked: "ya cocidas",
        },
        { name: "Arroz basmati / integral o pasta integral", quantity: "60g" },
        { name: "Quinoa", quantity: "60g" },
        { name: "Wrap integral", quantity: "2 uds" },
      ]),
    ],
  },
};

export const preEntreno: Meal = {
  type: "pre_entreno",
  label: "Pre-entreno",
  supplements: [SUPLEMENTOS.creatina, SUPLEMENTOS.citrulina],
  optionalNote: "Tomar 1h 30min antes de entrenar (combo pre-entreno 30min antes)",
  training: {
    options: [
      {
        id: "pre-unica",
        label: "Pre-entreno",
        carbs: {
          items: [{ name: "Plátano", quantity: "1 pieza" }],
        },
        protein: {
          items: [
            {
              name: "Proteína en polvo",
              quantity: "35g",
              quantityCooked: "con leche vegetal o desnatada sin lactosa",
            },
          ],
        },
        fats: {
          items: [{ name: "Crema de cacahuete o frutos secos", quantity: "15g" }],
        },
      },
    ],
  },
};

export const merienda: Meal = {
  type: "merienda",
  label: "Merienda",
  supplements: [],
  optionalNote: "Solo en días de descanso (en días de entreno hay pre-entreno)",
  rest: {
    options: [
      {
        id: "merienda-dulce",
        label: "A — Dulce",
        carbs: {
          pick: true,
          items: [
            { name: "Manzana", quantity: "1 pieza" },
            { name: "Frutos rojos o arándanos", quantity: "80g" },
          ],
        },
        protein: {
          items: [{ name: "Yogur griego 0% o QFB 0%", quantity: "200g" }],
        },
        fats: {
          items: [
            { name: "Crema de cacahuete o frutos secos", quantity: "10g" },
          ],
        },
      },
      {
        id: "merienda-salado",
        label: "B — Salado",
        carbs: {
          items: [{ name: "Pan integral / centeno / espelta", quantity: "80g" }],
        },
        protein: {
          pick: true,
          items: [
            { name: "Fiambre de pavo o pollo", quantity: "80g" },
            { name: "Jamón serrano", quantity: "40g" },
          ],
        },
      },
    ],
  },
};

export const cena: Meal = {
  type: "cena",
  label: "Cena",
  supplements: [SUPLEMENTOS.omega3, SUPLEMENTOS.sleep],
  training: {
    options: [
      makeCenaOption(
        [
          { name: "Patata o boniato", quantity: "250g" },
          {
            name: "Garbanzos / Lentejas / Alubias",
            quantity: "150g",
            quantityCooked: "ya cocidas",
          },
          { name: "Arroz basmati / integral o pasta integral", quantity: "60g" },
          { name: "Quinoa", quantity: "60g" },
          { name: "Wrap integral", quantity: "2 uds" },
        ],
        GRASAS_COMIDA
      ),
    ],
  },
  rest: {
    options: [
      makeCenaOption(
        [
          { name: "Patata o boniato", quantity: "250g" },
          { name: "Ñoquis", quantity: "200g" },
          { name: "Arroz basmati / integral o pasta integral", quantity: "60g" },
          { name: "Quinoa", quantity: "60g" },
          { name: "Wrap integral", quantity: "2 uds" },
        ],
        GRASAS_CENA_REST
      ),
    ],
  },
};

export const DIET_PLAN: Record<Meal["type"], Meal> = {
  desayuno,
  comida,
  pre_entreno: preEntreno,
  merienda,
  cena,
};

export const NUTRITION_RULES = [
  "Objetivo: recomposición corporal (pérdida de grasa + ganancia muscular)",
  "1–2 comidas libres a la semana (mejor post-entreno, con buena base de proteína)",
  "Cantidades en crudo (salvo que indique cocido)",
  "Priorizar plancha, horno, vapor o salteados. Evitar fritos y rebozados",
  "Verduras: consumo libre e ilimitado en comida y cena",
  "Fruta: entera, no zumos",
  "Pan: integral, centeno o espelta",
  "Yogures: sin azúcar añadido o 0%",
  "Tomate triturado/tamizado sin azúcares añadidos",
  "Refrescos: solo 0 azúcares",
  "Para endulzar: mejor canela o eritritol",
  "Si usas tofu, reduce 10g de grasas",
  "Si usas pescado azul (salmón, atún), reduce 5–10g de grasa",
];

export const LIBRES_POR_SEMANA = 2;
