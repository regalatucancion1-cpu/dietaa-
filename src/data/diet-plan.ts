import type { FixedMeal, VariableMeal } from "@/types/diet";
import { SUPLEMENTOS } from "./supplements";

// ============================================================
// COMIDAS FIJAS (mismas opciones todos los días)
// ============================================================

export const desayuno: FixedMeal = {
  type: "desayuno",
  label: "Desayuno",
  supplements: [
    SUPLEMENTOS.multivitaminico,
    SUPLEMENTOS.omega3,
    SUPLEMENTOS.vitaminaD3,
    SUPLEMENTOS.quemaGrasas,
  ],
  optionalNote: "Café o infusión (¡¡NO le eches azúcar!!)",
  options: [
    {
      id: "desayuno-a",
      label: "Cereales + Proteína",
      carbs: [
        { name: "Cereales o avena", quantity: "75g" },
      ],
      protein: {
        options: [
          { name: "Proteína en polvo", quantity: "30g" },
        ],
      },
      extras: [
        { name: "Leche o bebida vegetal", quantity: "250ml" },
      ],
      notes: "Cereales con menos de 7g de azúcar por 100g",
    },
    {
      id: "desayuno-b",
      label: "Pan/Tortitas + Embutido",
      carbs: [
        { name: "Pan", quantity: "75g" },
        { name: "Tortitas de arroz/maíz", quantity: "4 uds" },
      ],
      protein: {
        options: [
          { name: "Jamón york o pavo", quantity: "60g" },
          { name: "Jamón serrano", quantity: "30g" },
          { name: "Tortilla de huevos", quantity: "2 huevos" },
          { name: "Lomo embuchado", quantity: "35g" },
        ],
      },
      notes: "Pan con menos de 7g de azúcar por 100g",
    },
  ],
};

export const mediaManana: FixedMeal = {
  type: "media_manana",
  label: "Media Mañana",
  supplements: [],
  options: [
    {
      id: "media-a",
      label: "Pan/Tortitas + Embutido",
      carbs: [
        { name: "Pan", quantity: "50g" },
        { name: "Tortitas de arroz/maíz", quantity: "4 uds" },
      ],
      protein: {
        options: [
          { name: "Jamón york o pavo", quantity: "40g" },
          { name: "Jamón serrano", quantity: "20g" },
          { name: "Lomo embuchado", quantity: "35g" },
          { name: "Atún al natural (lata)", quantity: "1 lata" },
        ],
      },
    },
    {
      id: "media-b",
      label: "Cereales + Proteína",
      carbs: [
        { name: "Cereales o avena", quantity: "50g" },
      ],
      protein: {
        options: [
          { name: "Proteína en polvo", quantity: "30g" },
        ],
      },
      extras: [
        { name: "Leche o bebida vegetal", quantity: "250ml" },
      ],
      notes: "Cereales con menos de 7g de azúcar por 100g",
    },
  ],
  nonTrainingOverride: {
    id: "media-no-entreno",
    label: "Día sin entrenamiento",
    carbs: [
      { name: "Pieza de fruta", quantity: "1 pieza" },
    ],
    protein: {
      options: [
        { name: "Proteína en polvo", quantity: "30g" },
      ],
    },
    extras: [
      { name: "Leche o bebida vegetal", quantity: "250ml" },
    ],
  },
};

export const merienda: FixedMeal = {
  type: "merienda",
  label: "Merienda",
  supplements: [],
  options: [
    {
      id: "merienda-a",
      label: "Cereales + Proteína",
      carbs: [
        { name: "Cereales o avena", quantity: "50g" },
      ],
      protein: {
        options: [
          { name: "Proteína en polvo", quantity: "40g" },
        ],
      },
      extras: [
        { name: "Leche o bebida vegetal", quantity: "250-300ml" },
      ],
    },
    {
      id: "merienda-b",
      label: "Pan/Tortitas + Embutido",
      carbs: [
        { name: "Pan", quantity: "50g" },
        { name: "Tortitas de arroz/maíz", quantity: "4 uds" },
      ],
      protein: {
        options: [
          { name: "Jamón york o pavo", quantity: "50g" },
          { name: "Jamón serrano", quantity: "25g" },
          { name: "Lomo embuchado", quantity: "35g" },
          { name: "Atún al natural (lata)", quantity: "1 lata" },
        ],
      },
      notes: "Pan con menos de 7g de azúcar por 100g",
    },
  ],
};

// ============================================================
// COMIDA (varía por día)
// ============================================================

export const comida: VariableMeal = {
  type: "comida",
  label: "Comida",
  supplements: [SUPLEMENTOS.omega3, SUPLEMENTOS.vitaminaC],
  days: [
    {
      day: "lunes",
      carbOptions: [
        { name: "Arroz", quantity: "50g", quantityCooked: "150g cocido" },
        { name: "Legumbres", quantity: "60g", quantityCooked: "180g cocidas/de bote" },
        { name: "Pan", quantity: "70g" },
      ],
      proteinOptions: [
        {
          options: [
            { name: "Pechuga de pollo", quantity: "175g" },
            { name: "Hamburguesa de pollo", quantity: "175g" },
            { name: "Solomillo de pollo", quantity: "175g" },
            { name: "Carne picada de pollo", quantity: "175g" },
          ],
        },
        {
          options: [
            { name: "Tortilla de huevos", quantity: "2 huevos" },
            { name: "Huevos cocidos", quantity: "2 huevos" },
            { name: "Clara de huevo", quantity: "200ml" },
          ],
        },
      ],
    },
    {
      day: "martes",
      carbOptions: [
        { name: "Puré de verdura", quantity: "libre" },
        { name: "Ensalada mixta", quantity: "libre" },
        { name: "Gazpacho", quantity: "libre" },
        { name: "Verdura", quantity: "libre" },
      ],
      proteinOptions: [
        {
          options: [
            { name: "Tortilla de huevos", quantity: "2 huevos" },
            { name: "Clara de huevo", quantity: "200ml" },
          ],
        },
        {
          options: [
            { name: "Filete de ternera", quantity: "150g" },
            { name: "Bistec de ternera", quantity: "150g" },
            { name: "Hamburguesa de ternera", quantity: "150g" },
            { name: "Carne picada de ternera", quantity: "150g" },
          ],
        },
      ],
      extras: [
        { name: "½ aguacate o 30g frutos secos o 1 huevo a la plancha", quantity: "" },
      ],
      notes: "Máximo 1 cucharada pequeña de aceite en la ensalada",
    },
    {
      day: "miercoles",
      carbOptions: [
        { name: "Gnocchis", quantity: "150g" },
        { name: "Pan", quantity: "60g" },
        { name: "Arroz", quantity: "50g", quantityCooked: "150g cocido" },
      ],
      proteinOptions: [
        {
          options: [
            { name: "Pechuga de pavo", quantity: "160g" },
            { name: "Lomo", quantity: "160g" },
            { name: "Pincho amarillo con perejil", quantity: "160g" },
          ],
        },
        {
          options: [
            { name: "Pechuga de pollo", quantity: "150g" },
            { name: "Hamburguesa de pollo", quantity: "150g" },
            { name: "Solomillo de pollo", quantity: "150g" },
            { name: "Carne picada de pollo", quantity: "150g" },
          ],
        },
      ],
    },
    {
      day: "jueves",
      carbOptions: [
        { name: "Legumbres", quantity: "50g", quantityCooked: "180g cocidas/de bote" },
        { name: "Patata o boniato", quantity: "150g" },
        { name: "Pan", quantity: "60g" },
      ],
      proteinOptions: [
        {
          options: [
            { name: "Filete de ternera", quantity: "150g" },
            { name: "Bistec de ternera", quantity: "150g" },
            { name: "Hamburguesa de ternera", quantity: "150g" },
            { name: "Carne picada de ternera", quantity: "150g" },
          ],
        },
        {
          options: [
            { name: "Tortilla de huevos", quantity: "2 huevos" },
            { name: "Clara de huevo", quantity: "200ml" },
          ],
        },
      ],
    },
    {
      day: "viernes",
      carbOptions: [
        { name: "Arroz", quantity: "50g", quantityCooked: "150g cocido" },
        { name: "Patata o boniato", quantity: "200g" },
        { name: "Pasta", quantity: "60g", quantityCooked: "130g cocida" },
      ],
      proteinOptions: [
        {
          options: [
            { name: "Pechuga de pollo", quantity: "160g" },
            { name: "Hamburguesa de pollo", quantity: "160g" },
            { name: "Solomillo de pollo", quantity: "160g" },
            { name: "Carne picada de pollo", quantity: "160g" },
          ],
        },
        {
          options: [
            { name: "Tortilla de huevos", quantity: "2 huevos" },
            { name: "Clara de huevo", quantity: "200ml" },
          ],
        },
      ],
    },
    {
      day: "sabado",
      carbOptions: [
        { name: "Pasta", quantity: "60g", quantityCooked: "130g cocida" },
        { name: "Arroz", quantity: "60g", quantityCooked: "150g cocido" },
        { name: "Legumbres", quantity: "50g", quantityCooked: "180g de bote" },
      ],
      proteinOptions: [
        {
          options: [
            { name: "Pechuga de pavo", quantity: "175g" },
            { name: "Lomo", quantity: "175g" },
            { name: "Pincho amarillo con perejil", quantity: "175g" },
          ],
        },
        {
          options: [
            { name: "Filete de ternera", quantity: "150g" },
            { name: "Bistec de ternera", quantity: "150g" },
            { name: "Hamburguesa de ternera", quantity: "150g" },
            { name: "Carne picada de ternera", quantity: "150g" },
          ],
        },
      ],
    },
    {
      day: "domingo",
      carbOptions: [
        { name: "Gnocchis", quantity: "150g" },
        { name: "Patata o boniato", quantity: "200g" },
        { name: "Arroz", quantity: "50g", quantityCooked: "150g cocido" },
      ],
      proteinOptions: [
        {
          options: [
            { name: "Filete de ternera", quantity: "150g" },
            { name: "Bistec de ternera", quantity: "150g" },
            { name: "Hamburguesa de ternera", quantity: "150g" },
            { name: "Carne picada de ternera", quantity: "150g" },
          ],
        },
        {
          options: [
            { name: "Pechuga de pollo", quantity: "160g" },
            { name: "Hamburguesa de pollo", quantity: "160g" },
            { name: "Solomillo de pollo", quantity: "160g" },
            { name: "Carne picada de pollo", quantity: "160g" },
          ],
        },
      ],
      extras: [
        { name: "Huevo a la plancha", quantity: "1 huevo" },
      ],
      notes: "Controla el aceite",
    },
  ],
};

// ============================================================
// CENA (varía por día)
// ============================================================

export const cena: VariableMeal = {
  type: "cena",
  label: "Cena",
  supplements: [],
  days: [
    {
      day: "lunes",
      carbOptions: [
        { name: "Pasta", quantity: "60g", quantityCooked: "150g cocida" },
        { name: "Wraps tipo burrito", quantity: "2 uds" },
        { name: "Pan", quantity: "60g" },
      ],
      proteinOptions: [
        {
          options: [
            { name: "Filete de ternera", quantity: "150g" },
            { name: "Bistec de ternera", quantity: "150g" },
            { name: "Hamburguesa de ternera", quantity: "150g" },
            { name: "Carne picada de ternera", quantity: "150g" },
          ],
        },
        {
          options: [
            { name: "Pechuga de pavo", quantity: "160g" },
            { name: "Lomo", quantity: "160g" },
            { name: "Pincho amarillo con perejil", quantity: "160g" },
          ],
        },
      ],
    },
    {
      day: "martes",
      carbOptions: [
        { name: "Arroz", quantity: "60g", quantityCooked: "180g cocido" },
        { name: "Pasta", quantity: "60g", quantityCooked: "160g cocida" },
        { name: "Pan", quantity: "70g" },
      ],
      proteinOptions: [
        {
          options: [
            { name: "Pechuga de pavo", quantity: "150g" },
            { name: "Lomo", quantity: "150g" },
            { name: "Pincho amarillo con perejil", quantity: "150g" },
          ],
        },
        {
          options: [
            { name: "Pechuga de pollo", quantity: "185g" },
            { name: "Hamburguesa de pollo", quantity: "185g" },
            { name: "Solomillo de pollo", quantity: "185g" },
            { name: "Carne picada de pollo", quantity: "185g" },
          ],
        },
      ],
    },
    {
      day: "miercoles",
      carbOptions: [
        { name: "Patata o boniato", quantity: "200g" },
        { name: "Pan", quantity: "60g" },
        { name: "Pasta", quantity: "60g", quantityCooked: "130g cocida" },
      ],
      proteinOptions: [
        {
          options: [
            { name: "Pechuga de pavo", quantity: "150g" },
            { name: "Lomo", quantity: "150g" },
            { name: "Pincho amarillo", quantity: "150g" },
          ],
        },
        {
          options: [
            { name: "Filete de ternera", quantity: "150g" },
            { name: "Bistec de ternera", quantity: "150g" },
            { name: "Hamburguesa de ternera", quantity: "150g" },
            { name: "Carne picada de ternera", quantity: "150g" },
          ],
        },
      ],
    },
    {
      day: "jueves",
      carbOptions: [
        { name: "Ensalada mixta", quantity: "libre" },
        { name: "Gazpacho", quantity: "libre" },
        { name: "Verdura", quantity: "libre" },
      ],
      proteinOptions: [
        {
          options: [
            { name: "Tortilla de huevos", quantity: "3 huevos" },
            { name: "Clara de huevo", quantity: "300ml" },
          ],
        },
        {
          options: [
            { name: "Filete de ternera", quantity: "150g" },
            { name: "Bistec de ternera", quantity: "150g" },
            { name: "Hamburguesa de ternera", quantity: "150g" },
            { name: "Carne picada de ternera", quantity: "150g" },
          ],
        },
      ],
      extras: [
        { name: "½ aguacate o 30g frutos secos", quantity: "" },
      ],
    },
    {
      day: "viernes",
      carbOptions: [
        { name: "Wraps tipo burrito", quantity: "2 uds" },
        { name: "Gnocchis", quantity: "150g" },
        { name: "Pan", quantity: "60g" },
        { name: "Arroz", quantity: "50g", quantityCooked: "150g cocido" },
      ],
      proteinOptions: [
        {
          options: [
            { name: "Filete de ternera", quantity: "160g" },
            { name: "Bistec de ternera", quantity: "160g" },
            { name: "Hamburguesa de ternera", quantity: "160g" },
            { name: "Carne picada de ternera", quantity: "160g" },
          ],
        },
        {
          options: [
            { name: "Pechuga de pollo", quantity: "150g" },
            { name: "Hamburguesa de pollo", quantity: "150g" },
            { name: "Solomillo de pollo", quantity: "150g" },
            { name: "Carne picada de pollo", quantity: "150g" },
          ],
        },
      ],
    },
    {
      day: "sabado",
      carbOptions: [
        { name: "Ensalada mixta", quantity: "libre" },
        { name: "Gazpacho", quantity: "libre" },
        { name: "Verdura", quantity: "libre" },
      ],
      proteinOptions: [
        {
          options: [
            { name: "Pechuga de pollo", quantity: "200g" },
            { name: "Hamburguesa de pollo", quantity: "200g" },
            { name: "Solomillo de pollo", quantity: "200g" },
            { name: "Carne picada de pollo", quantity: "200g" },
          ],
        },
        {
          options: [
            { name: "Tortilla de huevos", quantity: "2 huevos" },
            { name: "Clara de huevo", quantity: "250ml" },
          ],
        },
      ],
      extras: [
        { name: "½ aguacate o 30g frutos secos", quantity: "" },
      ],
    },
    {
      day: "domingo",
      carbOptions: [
        { name: "Gnocchis", quantity: "150g" },
        { name: "Pan", quantity: "50g" },
        { name: "Wraps tipo burrito", quantity: "2 uds" },
        { name: "Pasta", quantity: "50g", quantityCooked: "130g cocida" },
      ],
      proteinOptions: [
        {
          options: [
            { name: "Pechuga de pavo", quantity: "175g" },
            { name: "Lomo", quantity: "175g" },
            { name: "Pincho amarillo con perejil", quantity: "175g" },
          ],
        },
        {
          options: [
            { name: "Filete de ternera", quantity: "160g" },
            { name: "Bistec de ternera", quantity: "160g" },
            { name: "Carne picada de ternera", quantity: "160g" },
            { name: "Hamburguesa de ternera", quantity: "160g" },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// EXPORT COMPLETO
// ============================================================

export const DIET_PLAN = {
  fixed: {
    desayuno,
    media_manana: mediaManana,
    merienda,
  },
  variable: {
    comida,
    cena,
  },
};

export const NUTRITION_RULES = [
  "Cantidades en crudo (pasta, arroz, legumbres incluyen equivalencia cocida)",
  "Evitar fritos y rebozados — priorizar plancha, horno, vapor o salteados",
  "Especias: puedes usarlas sin problema (cúrcuma, curry, pimienta, etc.)",
  "Verduras: consumo libre y sin límite en todas las comidas",
  "Fruta: máximo 2-3 piezas al día, siempre entera (no zumos)",
  "Yogures: menos de 7g de azúcar por 100g",
  "Cereales: menos de 7g de azúcar por 100g",
  "Pan de molde: menos de 7g de azúcar por 100g",
  "Gazpacho: menos de 60 kcal por 100ml",
  "Tomate: triturado/tamizado sin azúcares añadidos, menos de 7g azúcar por 100g",
  "Refrescos: solo 0 azúcares",
  "Postres permitidos: yogur, gelatina, café, té o fruta",
  "Aceite en ensalada: máximo 1 cucharada pequeña",
  "Para endulzar: mejor canela o eritritol",
  "Los días y opciones son orientativos — puedes intercambiarlos según te venga mejor",
  "Eventos sociales: disfruta, pero prioriza opciones saludables y cuidado con rebozados, postres y alcohol",
];
