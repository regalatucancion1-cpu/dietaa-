"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart } from "lucide-react";
import { useSelections, useTrainingDays } from "@/hooks/use-meal-selections";
import { DIET_PLAN } from "@/data/diet-plan";
import {
  DAYS,
  MEAL_ORDER,
  type DayOfWeek,
  type MealType,
  type MealSelection,
  type FoodOption,
} from "@/types/diet";
import { getActiveVariant, getActiveOption } from "@/lib/meal-calculator";
import { useState } from "react";

interface ShoppingItem {
  name: string;
  quantity: string;
  category: string;
}

function categorize(name: string): string {
  const l = name.toLowerCase();
  if (l.includes("pollo") || l.includes("pavo") || l.includes("ternera") || l.includes("cerdo") || l.includes("fiambre") || l.includes("jamón") || l.includes("lomo") || l.includes("tofu") || l.includes("huevo") || l.includes("clara") || l.includes("yogur") || l.includes("qfb") || l.includes("kéfir") || l.includes("pescado") || l.includes("atún") || l.includes("salmón"))
    return "Proteína";
  if (l.includes("avena") || l.includes("pan") || l.includes("arroz") || l.includes("quinoa") || l.includes("pasta") || l.includes("patata") || l.includes("boniato") || l.includes("garbanzo") || l.includes("lenteja") || l.includes("alubia") || l.includes("ñoqui") || l.includes("wrap") || l.includes("plátano") || l.includes("manzana") || l.includes("fruta") || l.includes("frutos rojos") || l.includes("arándano"))
    return "Carbohidratos";
  if (l.includes("aove") || l.includes("aguacate") || l.includes("guacamole") || l.includes("crema") || l.includes("frutos secos") || l.includes("ya incluidas"))
    return "Grasas";
  if (l.includes("verdura")) return "Verduras";
  if (l.includes("chocolate") || l.includes("postre")) return "Extras";
  return "Varios";
}

function collectSection(
  section: { pick?: boolean; items: FoodOption[] } | undefined,
  pickIndex: number,
  out: ShoppingItem[]
) {
  if (!section) return;
  const items = section.pick
    ? [section.items[pickIndex] ?? section.items[0]]
    : section.items;
  for (const item of items) {
    if (!item || !item.quantity || item.quantity === "libre") continue;
    out.push({ name: item.name, quantity: item.quantity, category: categorize(item.name) });
  }
}

function generateShoppingList(
  selections: Record<DayOfWeek, Record<MealType, MealSelection>>,
  trainingDays: Record<DayOfWeek, boolean>
): ShoppingItem[] {
  const items: ShoppingItem[] = [];

  for (const day of DAYS) {
    const isTraining = trainingDays[day];
    for (const mealType of MEAL_ORDER) {
      const meal = DIET_PLAN[mealType];
      if (!getActiveVariant(meal, isTraining)) continue;
      const sel = selections[day][mealType];
      const option = getActiveOption(meal, sel, isTraining);
      if (!option) continue;

      collectSection(option.carbs, sel.carbIndex ?? 0, items);
      collectSection(option.protein, sel.proteinIndex ?? 0, items);
      collectSection(option.fats, sel.fatIndex ?? 0, items);
      if (option.extras) {
        for (const e of option.extras) {
          if (!e.quantity || e.quantity === "libre") continue;
          items.push({ name: e.name, quantity: e.quantity, category: categorize(e.name) });
        }
      }
      if (option.dessert) {
        for (const d of option.dessert) {
          if (!d.quantity || d.quantity === "libre") continue;
          items.push({ name: d.name, quantity: d.quantity, category: categorize(d.name) });
        }
      }
    }
  }

  const grouped = new Map<string, { quantity: string; category: string; count: number }>();
  for (const item of items) {
    const existing = grouped.get(item.name);
    if (existing) {
      existing.count++;
    } else {
      grouped.set(item.name, { quantity: item.quantity, category: item.category, count: 1 });
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
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const items = generateShoppingList(selections, trainingDays);
  const categories = [...new Set(items.map((i) => i.category))];

  const toggleItem = (name: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="min-h-screen">
      <header className="border-b px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-orange-500" />
          <h1 className="text-xl font-bold">Lista de la Compra</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Generada automáticamente según tus selecciones de la semana
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
                    <li key={item.name} className="flex items-center gap-3 text-sm">
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
            No hay items. Selecciona tus comidas en el plan primero.
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          {checked.size} de {items.length} items completados
        </div>
      </div>
    </div>
  );
}
