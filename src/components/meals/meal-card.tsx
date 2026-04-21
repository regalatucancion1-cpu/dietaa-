"use client";

import { useMemo, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SupplementBadge } from "./supplement-badge";
import {
  Wheat,
  Dumbbell,
  Sandwich,
  Beef,
  Egg,
  CircleDot,
  Apple,
  TriangleAlert,
  ChevronDown,
  Flame,
  Euro,
  Droplet,
  Leaf,
  Cherry,
} from "lucide-react";
import type {
  Meal,
  MealOption,
  MealSelection,
  FoodOption,
  FoodSection,
} from "@/types/diet";
import { useSetSelection } from "@/hooks/use-meal-selections";
import { isMealPast } from "@/lib/time-utils";
import { cn } from "@/lib/utils";
import {
  calculateMealTotals,
  getActiveVariant,
  getActiveOption,
  type MealTotals,
} from "@/lib/meal-calculator";

interface Props {
  meal: Meal;
  day: import("@/types/diet").DayOfWeek;
  isTraining: boolean;
  selection: MealSelection;
  isToday: boolean;
  isCurrent: boolean;
  timeLabel: string;
}

function getFoodIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("avena") || lower.includes("cereal"))
    return <Wheat className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
  if (lower.includes("proteína") || lower.includes("yogur") || lower.includes("qfb") || lower.includes("kéfir"))
    return <Dumbbell className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
  if (lower.includes("pan") || lower.includes("wrap") || lower.includes("ñoqui") || lower.includes("gnocchi"))
    return <Sandwich className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
  if (lower.includes("huevo") || lower.includes("clara"))
    return <Egg className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
  if (
    lower.includes("pollo") ||
    lower.includes("pavo") ||
    lower.includes("ternera") ||
    lower.includes("jamón") ||
    lower.includes("lomo") ||
    lower.includes("fiambre") ||
    lower.includes("pescado") ||
    lower.includes("tofu") ||
    lower.includes("atún") ||
    lower.includes("salmón")
  )
    return <Beef className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
  if (
    lower.includes("fruta") ||
    lower.includes("manzana") ||
    lower.includes("plátano") ||
    lower.includes("frutos rojos") ||
    lower.includes("arándano")
  )
    return <Apple className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
  if (
    lower.includes("aove") ||
    lower.includes("aguacate") ||
    lower.includes("guacamole") ||
    lower.includes("crema cacahuete") ||
    lower.includes("frutos secos") ||
    lower.includes("ya incluidas")
  )
    return <Droplet className="h-3.5 w-3.5 text-amber-600 shrink-0" />;
  if (lower.includes("verdura"))
    return <Leaf className="h-3.5 w-3.5 text-green-600 shrink-0" />;
  if (lower.includes("chocolate"))
    return <Cherry className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
  if (
    lower.includes("arroz") ||
    lower.includes("pasta") ||
    lower.includes("quinoa") ||
    lower.includes("patata") ||
    lower.includes("boniato") ||
    lower.includes("legumbre") ||
    lower.includes("garbanzo") ||
    lower.includes("lenteja") ||
    lower.includes("alubia")
  )
    return <Wheat className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
  return <CircleDot className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
}

function FoodItemRow({ food, muted }: { food: FoodOption; muted?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <div className="pt-0.5">{getFoodIcon(food.name)}</div>
      <span className={cn("text-[13px] leading-snug", muted ? "text-muted-foreground" : "text-foreground")}>
        <span className="font-medium">{food.name}</span>{" "}
        {food.quantity && <span className="text-muted-foreground">{food.quantity}</span>}
        {food.quantityCooked && (
          <span className="block text-[11px] text-muted-foreground italic">
            {food.quantityCooked}
          </span>
        )}
      </span>
    </div>
  );
}

function MealTotalsBadge({ totals }: { totals: MealTotals }) {
  if (totals.kcal === 0 && totals.price === 0) return null;
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2 mt-1">
      <div className="flex items-center gap-1">
        <Flame className="h-3.5 w-3.5 text-orange-500" />
        <span className="text-xs font-semibold text-foreground">
          ~{totals.kcal} kcal
        </span>
      </div>
      <span className="text-muted-foreground text-xs">·</span>
      <div className="flex items-center gap-1">
        <Euro className="h-3.5 w-3.5 text-emerald-600" />
        <span className="text-xs font-semibold text-foreground">
          ~{totals.price.toFixed(2)} €
        </span>
      </div>
    </div>
  );
}

function WarningBox({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-[#FFF7ED] px-2.5 py-2">
      <TriangleAlert className="h-3.5 w-3.5 text-orange-500 shrink-0" />
      <span className="text-[11px] font-medium text-[#9A3412]">{text}</span>
    </div>
  );
}

function SectionPickerRadio({
  section,
  selectedIndex,
  onSelect,
  title,
}: {
  section: FoodSection;
  selectedIndex: number;
  onSelect: (i: number) => void;
  title: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-1.5">
        {title} <span className="font-normal opacity-70">(elige una)</span>
      </p>
      <RadioGroup
        value={String(Math.min(selectedIndex, section.items.length - 1))}
        onValueChange={(v) => onSelect(parseInt(v))}
        className="space-y-1"
      >
        {section.items.map((item, i) => (
          <label
            key={i}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors",
              selectedIndex === i ? "bg-orange-50" : "hover:bg-accent"
            )}
          >
            <RadioGroupItem value={String(i)} className="shrink-0" />
            <FoodItemRow food={item} />
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

function SectionList({
  section,
  title,
}: {
  section: FoodSection;
  title: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-1.5">{title}</p>
      <div className="space-y-1 ml-0">
        {section.items.map((item, i) => (
          <FoodItemRow key={i} food={item} />
        ))}
      </div>
    </div>
  );
}

function MealOptionBody({
  option,
  selection,
  onSelect,
}: {
  option: MealOption;
  selection: MealSelection;
  onSelect: (s: MealSelection) => void;
}) {
  return (
    <div className="space-y-3">
      {/* Carbs */}
      {option.carbs.pick ? (
        <SectionPickerRadio
          section={option.carbs}
          selectedIndex={selection.carbIndex ?? 0}
          onSelect={(i) => onSelect({ ...selection, carbIndex: i })}
          title="Hidratos"
        />
      ) : (
        <SectionList section={option.carbs} title="Hidratos" />
      )}

      <div className="border-t" />

      {/* Protein */}
      {option.protein.pick ? (
        <SectionPickerRadio
          section={option.protein}
          selectedIndex={selection.proteinIndex ?? 0}
          onSelect={(i) => onSelect({ ...selection, proteinIndex: i })}
          title="Proteína"
        />
      ) : (
        <SectionList section={option.protein} title="Proteína" />
      )}

      {/* Fats */}
      {option.fats && (
        <>
          <div className="border-t" />
          {option.fats.pick ? (
            <SectionPickerRadio
              section={option.fats}
              selectedIndex={selection.fatIndex ?? 0}
              onSelect={(i) => onSelect({ ...selection, fatIndex: i })}
              title="Grasas"
            />
          ) : (
            <SectionList section={option.fats} title="Grasas" />
          )}
        </>
      )}

      {/* Vegetables */}
      {option.vegetables && option.vegetables.length > 0 && (
        <>
          <div className="border-t" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">Verduras</p>
            {option.vegetables.map((v, i) => (
              <FoodItemRow key={i} food={v} />
            ))}
          </div>
        </>
      )}

      {/* Dessert */}
      {option.dessert && option.dessert.length > 0 && (
        <>
          <div className="border-t" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">Postre</p>
            <div className="space-y-1">
              {option.dessert.map((d, i) => (
                <FoodItemRow key={i} food={d} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Extras */}
      {option.extras && option.extras.length > 0 && (
        <>
          <div className="border-t" />
          <div className="space-y-1">
            {option.extras.map((e, i) => (
              <FoodItemRow key={i} food={e} muted />
            ))}
          </div>
        </>
      )}

      {/* Warning */}
      {option.notes && <WarningBox text={option.notes} />}
    </div>
  );
}

export function MealCard({
  meal,
  day,
  isTraining,
  selection,
  isToday,
  isCurrent,
  timeLabel,
}: Props) {
  const setSelection = useSetSelection();
  const variant = getActiveVariant(meal, isTraining);
  const isPast = isToday && isMealPast(meal.type);
  const [collapsed, setCollapsed] = useState(isPast);

  const totals = useMemo(
    () => calculateMealTotals(meal, selection, isTraining),
    [meal, selection, isTraining]
  );

  if (!variant) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/30 p-4 opacity-60">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/50" />
          <span className="text-base font-bold text-muted-foreground">
            {meal.label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {isTraining
            ? "Solo en días de descanso"
            : "Solo en días de entreno"}
        </p>
      </div>
    );
  }

  const options = variant.options;
  const activeId = selection.optionId ?? options[0]?.id;
  const activeOption = options.find((o) => o.id === activeId) ?? options[0];

  const onOptionChange = (id: string) => {
    setSelection(day, meal.type, {
      ...selection,
      optionId: id,
      carbIndex: 0,
      proteinIndex: 0,
      fatIndex: 0,
    });
  };

  const onInnerSelect = (sel: MealSelection) => {
    setSelection(day, meal.type, sel);
  };

  const mobileCollapsible = isToday && isPast;

  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-4 space-y-3 transition-all",
        isCurrent && "ring-2 ring-orange-400 shadow-lg shadow-orange-100",
        isPast && "opacity-50"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-2",
          mobileCollapsible && "cursor-pointer md:cursor-default"
        )}
        onClick={mobileCollapsible ? () => setCollapsed(!collapsed) : undefined}
      >
        <span
          className={cn(
            "w-2.5 h-2.5 rounded-full shrink-0",
            isCurrent ? "bg-orange-500 animate-pulse" : "bg-orange-500"
          )}
        />
        <span className="text-base font-bold text-foreground">{meal.label}</span>
        {isToday && timeLabel && (
          <span className="text-[11px] font-medium text-muted-foreground bg-muted rounded-lg px-2 py-0.5 ml-auto hidden md:inline">
            {timeLabel}
          </span>
        )}
        {mobileCollapsible && (
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground ml-auto transition-transform md:hidden",
              !collapsed && "rotate-180"
            )}
          />
        )}
      </div>

      <div className={cn(mobileCollapsible && collapsed && "hidden md:block")}>
        <div className="space-y-3">
          {/* Supplements */}
          {meal.supplements.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                Suplementos
              </p>
              <div className="flex flex-wrap gap-1.5">
                {meal.supplements.map((s) => (
                  <SupplementBadge key={s.id} supplement={s} />
                ))}
              </div>
            </div>
          )}

          {/* Optional note */}
          {meal.optionalNote && (
            <div className="text-[11px] text-muted-foreground italic bg-muted/40 px-2.5 py-1.5 rounded-lg">
              {meal.optionalNote}
            </div>
          )}

          {/* Options A/B selector if more than one */}
          {options.length > 1 ? (
            <RadioGroup
              value={activeId}
              onValueChange={onOptionChange}
              className="space-y-3"
            >
              {options.map((opt) => {
                const isSelected = activeId === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      "block rounded-xl border p-3 cursor-pointer transition-all",
                      isSelected
                        ? "border-orange-300 bg-orange-50/50 ring-1 ring-orange-200"
                        : "border-border hover:border-orange-200 hover:bg-orange-50/20"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <RadioGroupItem value={opt.id} />
                      <span className="text-sm font-semibold text-foreground">
                        {opt.label}
                      </span>
                    </div>
                    {isSelected && (
                      <MealOptionBody
                        option={opt}
                        selection={selection}
                        onSelect={onInnerSelect}
                      />
                    )}
                  </label>
                );
              })}
            </RadioGroup>
          ) : (
            activeOption && (
              <MealOptionBody
                option={activeOption}
                selection={selection}
                onSelect={onInnerSelect}
              />
            )
          )}

          <MealTotalsBadge totals={totals} />
        </div>
      </div>
    </div>
  );
}
