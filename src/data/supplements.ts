import type { Supplement } from "@/types/diet";

export const SUPLEMENTOS: Record<string, Supplement> = {
  multivitaminico: {
    id: "multivitaminico",
    name: "Multivitamínico",
    dosage: "1 cápsula",
    color: "bg-green-500",
  },
  omega3: {
    id: "omega3",
    name: "Omega 3",
    dosage: "1 cápsula",
    color: "bg-blue-500",
  },
  vitaminaD3: {
    id: "vitaminaD3",
    name: "Vitamina D3",
    dosage: "1 cápsula",
    color: "bg-yellow-500",
  },
  quemaGrasas: {
    id: "quemaGrasas",
    name: "Quema Grasas",
    dosage: "2 cápsulas",
    color: "bg-red-500",
  },
  vitaminaC: {
    id: "vitaminaC",
    name: "Vitamina C",
    dosage: "1 cápsula",
    color: "bg-orange-500",
  },
};
