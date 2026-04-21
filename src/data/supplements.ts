import type { Supplement } from "@/types/diet";

export const SUPLEMENTOS: Record<string, Supplement> = {
  vitaminaD: {
    id: "vitaminaD",
    name: "Vitamina D 2000 IU",
    dosage: "1 cápsula",
    color: "bg-yellow-500",
  },
  creatina: {
    id: "creatina",
    name: "Creatina",
    dosage: "8 g",
    color: "bg-purple-500",
  },
  citrulina: {
    id: "citrulina",
    name: "Citrulina Malato",
    dosage: "8 g",
    color: "bg-fuchsia-500",
  },
  omega3: {
    id: "omega3",
    name: "Omega 3",
    dosage: "1 g",
    color: "bg-blue-500",
  },
  sleep: {
    id: "sleep",
    name: "Sleep",
    dosage: "2 cápsulas",
    color: "bg-indigo-500",
  },
};
