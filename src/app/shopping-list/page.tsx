"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart } from "lucide-react";
import { useSelections, useTrainingDays, useMealStore } from "@/hooks/use-meal-selections";
import { DIET_PLAN } from "@/data/diet-plan";
import { DAYS, type DayOfWeek, type MealType, type MealSelection } from "@/types/diet";
import { useState } from "react";

interface ShoppingItem {
  name: string;
  quantity: string;
  category: string;
}

function generateShoppingList(
  selections: Record<DayOfWeek, Record<MealType, MealSelection>>,
  trainingDays: Record<DayOfWeek, boolean>
): ShoppingItem[] {
  const items: ShoppingItem[] = [];

  for (const day of DAYS) {
    const daySelections = selections[day];

    // Comidas fijas: desayuno, media_manana, merienda
    for (const mealType of ["desayuno", "media_manana", "merienda"] as MealType[]) {
      const meal = DIET_PLAN.fixed[mealType as keyof typeof DIET_PLAN.fixed];
      if (!meal) continue;

      const sel = daySelections[mealType];

      if (
        mealType === "media_manana" &&
        !trainingDays[day] &&
        meal.nonTrainingOverride
      ) {
        const override = meal.nonTrainingOverride;
        override.carbs.forEach((c) =>
          items.push({ name: c.name, quantity: c.quantity, category: "Varios" })
        );
        override.protein.options.forEach((p) =>
          items.push({ name: p.name, quantity: p.quantity, category: "Proteína" })
        );
        override.extras?.forEach((e) =>
          items.push({ name: e.name, quantity: e.quantity, category: "Varios" })
        );
        continue;
      }

      const optionId = sel.optionId || meal.options[0]?.id;
      const option = meal.options.find((o) => o.id === optionId) || meal.options[0];
      if (!option) continue;

      option.carbs.forEach((c) =>
        items.push({ name: c.name, quantity: c.quantity, category: "Carbohidratos" })
      );
      if (option.protein.options.length > 0) {
        const pIdx = sel.proteinIndex ?? 0;
        const protein = option.protein.options[pIdx] || option.protein.options[0];
        items.push({ name: protein.name, quantity: protein.quantity, category: "Proteína" });
      }
      option.extras?.forEach((e) =>
        items.push({ name: e.name, quantity: e.quantity, category: "Varios" })
      );
    }

    // Comidas variables: comida, cena
    for (const mealType of ["comida", "cena"] as MealType[]) {
      const meal = DIET_PLAN.variable[mealType as keyof typeof DIET_PLAN.variable];
      if (!meal) continue;

      const dayData = meal.days.find((d) => d.day === day);
      if (!dayData) continue;

      const sel = daySelections[mealType];
      const carbIdx = sel.carbIndex ?? 0;
      const proteinIdx = sel.proteinIndex ?? 0;

      const carb = dayData.carbOptions[carbIdx] || dayData.carbOptions[0];
      if (carb) {
        items.push({ name: carb.name, quantity: carb.quantity, category: "Carbohidratos" });
      }

      const proteinGroup = dayData.proteinOptions[proteinIdx] || dayData.proteinOptions[0];
      if (proteinGroup?.options.length > 0) {
        items.push({
          name: proteinGroup.options[0].name,
          quantity: proteinGroup.options[0].quantity,
          category: "Proteína",
        });
      }

      dayData.extras?.forEach((e) =>
        items.push({ name: e.name, quantity: e.quantity || "1", category: "Extras" })
      );
    }
  }

  // Agrupar por nombre
  const grouped = new Map<string, { quantity: string; category: string; count: number }>();
  for (const item of items) {
    const key = item.name;
    const existing = grouped.get(key);
    if (existing) {
      existing.count++;
    } else {
      grouped.set(key, { quantity: item.quantity, category: item.category, count: 1 });
    }
  }

  return Array.from(grouped.entries()).map(([name, data]) => ({
    name,
    quantity: data.count > 1 ? `${data.quantity} × ${data.count}` : data.quantity,
    category: data.category,
  }));
}

export default function ShoppingListPage() {
  const selections = useSelections();
  const trainingDays = useTrainingDays();
  const activeProfile = useMealStore((s) => s.activeProfile);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const items = generateShoppingList(selections, trainingDays);

  const categories = [...new Set(items.map((i) => i.category))];

  const toggleItem = (name: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen">
      <header className="border-b px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-orange-500" />
          <h1 className="text-xl font-bold">Lista de la Compra — {activeProfile === "dani" ? "Dani" : "Nil"}</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Generada automáticamente según tus selecciones de comida
        </p>
      </header>

      <div className="p-4 md:p-6 space-y-4 pb-24 md:pb-6">
        {categories.map((category) => (
          <Card key={category}>
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-semibold text-orange-600">
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ul className="space-y-2">
                {items
                  .filter((i) => i.category === category)
                  .map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center gap-3 text-sm"
                    >
                      <Checkbox
                        checked={checked.has(item.name)}
                        onCheckedChange={() => toggleItem(item.name)}
                      />
                      <span
                        className={
                          checked.has(item.name)
                            ? "line-through text-muted-foreground"
                            : ""
                        }
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground ml-2">
                          {item.quantity}
                        </span>
                      </span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        ))}

        {items.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No hay items. Selecciona tus comidas en el plan semanal primero.
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          {checked.size} de {items.length} items completados
        </div>
      </div>
    </div>
  );
}
