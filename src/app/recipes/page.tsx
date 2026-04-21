"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Search, X, Clock, Tag, Flame, Euro } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RECIPES,
  MEAL_LABELS,
  RECIPE_NUTRITION,
  type Recipe,
} from "@/data/recipes";
import type { MealType } from "@/types/diet";

type FilterMeal = "all" | MealType;
type FilterVariant = "all" | "training" | "rest";
type SortBy = "default" | "kcal-asc" | "kcal-desc" | "price-asc" | "price-desc";

const MEAL_FILTERS: { id: FilterMeal; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "desayuno", label: "Desayuno" },
  { id: "comida", label: "Comida" },
  { id: "pre_entreno", label: "Pre-entreno" },
  { id: "merienda", label: "Merienda" },
  { id: "cena", label: "Cena" },
];

const VARIANT_FILTERS: { id: FilterVariant; label: string }[] = [
  { id: "all", label: "Todos los días" },
  { id: "training", label: "Entreno" },
  { id: "rest", label: "Descanso" },
];

function variantBadge(variant: Recipe["variant"]) {
  if (variant === "training")
    return { label: "Entreno", color: "bg-orange-100 text-orange-700" };
  if (variant === "rest")
    return { label: "Descanso", color: "bg-blue-100 text-blue-700" };
  return { label: "Entreno y descanso", color: "bg-muted text-muted-foreground" };
}

export default function RecipesPage() {
  const [meal, setMeal] = useState<FilterMeal>("all");
  const [variant, setVariant] = useState<FilterVariant>("all");
  const [easyOnly, setEasyOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("default");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = RECIPES.filter((r) => {
      if (meal !== "all" && r.mealType !== meal) return false;
      if (variant !== "all" && r.variant !== variant && r.variant !== "both")
        return false;
      if (easyOnly && !r.tags?.includes("fácil")) return false;
      if (!q) return true;
      const hay = [r.name, ...(r.tags ?? []), ...r.ingredients]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
    if (sortBy === "default") return base;
    const get = (r: Recipe, k: "kcal" | "price") =>
      RECIPE_NUTRITION[r.id]?.[k] ?? Number.POSITIVE_INFINITY;
    return [...base].sort((a, b) => {
      if (sortBy === "kcal-asc") return get(a, "kcal") - get(b, "kcal");
      if (sortBy === "kcal-desc") return get(b, "kcal") - get(a, "kcal");
      if (sortBy === "price-asc") return get(a, "price") - get(b, "price");
      return get(b, "price") - get(a, "price");
    });
  }, [meal, variant, easyOnly, sortBy, search]);

  const countsByMeal = useMemo(() => {
    const c: Record<string, number> = { all: RECIPES.length };
    for (const r of RECIPES) c[r.mealType] = (c[r.mealType] ?? 0) + 1;
    return c;
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 md:pb-6">
      <div className="px-4 py-6 md:px-8 max-w-6xl mx-auto space-y-5">
        <div>
          <h1 className="text-[28px] font-bold text-foreground flex items-center gap-2">
            <ChefHat className="h-7 w-7 text-orange-500" />
            Recetas
          </h1>
          <p className="text-sm text-muted-foreground">
            100 ideas que encajan con tu pauta
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre, ingrediente o tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-md border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Meal filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {MEAL_FILTERS.map((m) => {
            const active = meal === m.id;
            const count = countsByMeal[m.id] ?? 0;
            return (
              <button
                key={m.id}
                onClick={() => setMeal(m.id)}
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors",
                  active
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-muted-foreground border-border hover:border-orange-200"
                )}
              >
                {m.label}
                <span className={cn("ml-1.5", active ? "opacity-80" : "text-muted-foreground/70")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Variant + Easy filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {VARIANT_FILTERS.map((v) => {
            const active = variant === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setVariant(v.id)}
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors",
                  active
                    ? "bg-foreground text-white border-foreground"
                    : "bg-white text-muted-foreground border-border"
                )}
              >
                {v.label}
              </button>
            );
          })}
          <button
            onClick={() => setEasyOnly((v) => !v)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors",
              easyOnly
                ? "bg-green-500 text-white border-green-500"
                : "bg-white text-muted-foreground border-border hover:border-green-200"
            )}
          >
            ⚡ Solo fáciles
          </button>
        </div>

        {/* Results + Sort */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "receta" : "recetas"}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="text-xs bg-white border border-border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-300"
          >
            <option value="default">Orden por defecto</option>
            <option value="kcal-asc">Menos kcal primero</option>
            <option value="kcal-desc">Más kcal primero</option>
            <option value="price-asc">Más baratas primero</option>
            <option value="price-desc">Más caras primero</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((r) => {
            const isOpen = openId === r.id;
            const badge = variantBadge(r.variant);
            const nutri = RECIPE_NUTRITION[r.id];
            return (
              <Card key={r.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm leading-snug">{r.name}</CardTitle>
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0",
                        badge.color
                      )}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1 flex-wrap">
                    <span className="font-medium">{MEAL_LABELS[r.mealType]}</span>
                    {nutri && (
                      <>
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 font-medium">
                          <Flame className="h-3 w-3" />
                          {nutri.kcal} kcal
                        </span>
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                          <Euro className="h-3 w-3" />
                          {nutri.price.toFixed(2)}
                        </span>
                      </>
                    )}
                    {r.tags && r.tags.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {r.tags.join(", ")}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div>
                    <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                      Ingredientes
                    </h4>
                    <ul className="text-sm space-y-0.5">
                      {r.ingredients.map((ing, i) => (
                        <li key={i} className="text-foreground/90">
                          • {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {isOpen && (
                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mt-3 mb-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Preparación
                      </h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside text-foreground/90">
                        {r.steps.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpenId(isOpen ? null : r.id)}
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 w-full justify-start h-8 px-0"
                  >
                    {isOpen ? "Ocultar preparación" : "Ver preparación"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground py-12 text-sm">
            No hay recetas que coincidan.
          </div>
        )}
      </div>
    </div>
  );
}
