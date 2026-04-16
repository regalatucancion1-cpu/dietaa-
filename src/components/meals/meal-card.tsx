"use client";

import { useState, useMemo } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SupplementBadge } from "./supplement-badge";
import {
  Coffee,
  Wheat,
  Dumbbell,
  Sandwich,
  Beef,
  Egg,
  CircleDot,
  Plus,
  Apple,
  TriangleAlert,
  ChevronDown,
  Flame,
  Euro,
} from "lucide-react";
import type {
  FixedMeal,
  VariableMeal,
  DayOfWeek,
  MealSelection,
  FoodOption,
  MealType,
} from "@/types/diet";
import { isFixedMeal } from "@/types/diet";
import {
  useSelections,
  useTrainingDays,
  useSetSelection,
} from "@/hooks/use-meal-selections";
import { isMealPast } from "@/lib/time-utils";
import { cn } from "@/lib/utils";
import {
  calculateFixedMealTotals,
  calculateVariableMealTotals,
  type MealTotals,
} from "@/lib/meal-calculator";

interface MealCardProps {
  meal: FixedMeal | VariableMeal;
  day: DayOfWeek;
  isToday: boolean;
  isCurrent: boolean;
  timeLabel: string;
}

// Icon mapping based on food name keywords
function getFoodIcon(name: string, isExtra?: boolean) {
  const lower = name.toLowerCase();
  if (isExtra) return <Plus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />;
  if (lower.includes("cereal") || lower.includes("avena"))
    return <Wheat className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
  if (lower.includes("proteína en polvo"))
    return <Dumbbell className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
  if (lower.includes("pan") || lower.includes("tortita") || lower.includes("wrap") || lower.includes("gnocchi"))
    return <Sandwich className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
  if (lower.includes("huevo") || lower.includes("tortilla") || lower.includes("clara"))
    return <Egg className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
  if (
    lower.includes("jamón") ||
    lower.includes("pavo") ||
    lower.includes("lomo") ||
    lower.includes("atún") ||
    lower.includes("ternera") ||
    lower.includes("pollo") ||
    lower.includes("carne") ||
    lower.includes("pincho") ||
    lower.includes("hamburguesa") ||
    lower.includes("bistec") ||
    lower.includes("filete") ||
    lower.includes("solomillo") ||
    lower.includes("pechuga") ||
    lower.includes("embutido")
  )
    return <Beef className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
  if (lower.includes("fruta"))
    return <Apple className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
  if (lower.includes("leche") || lower.includes("bebida vegetal"))
    return <Plus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />;
  if (lower.includes("ensalada") || lower.includes("verdura") || lower.includes("gazpacho") || lower.includes("puré"))
    return <CircleDot className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
  if (lower.includes("pasta") || lower.includes("arroz") || lower.includes("legumbre") || lower.includes("patata") || lower.includes("boniato"))
    return <Wheat className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
  return <CircleDot className="h-3.5 w-3.5 text-orange-500 shrink-0" />;
}

function FoodItemRow({ food, muted }: { food: FoodOption; muted?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {getFoodIcon(food.name, false)}
      <span
        className={cn(
          "text-[13px]",
          muted ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {food.name} {food.quantity}
        {food.quantityCooked && ` (${food.quantityCooked})`}
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

function ProteinSubSelector({
  options,
  selectedIndex,
  onSelect,
}: {
  options: FoodOption[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  if (options.length <= 1) return null;
  return (
    <div className="pl-8 pt-1 pb-1 space-y-0.5">
      {options.map((p, j) => (
        <button
          key={j}
          type="button"
          onClick={() => onSelect(j)}
          className={cn(
            "flex items-center gap-2 w-full text-left px-2 py-1 rounded-md text-[13px] transition-colors",
            selectedIndex === j
              ? "bg-orange-100 text-foreground font-medium"
              : "text-muted-foreground hover:bg-orange-100/50"
          )}
        >
          {getFoodIcon(p.name)}
          {p.name}
        </button>
      ))}
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

export function MealCard({
  meal,
  day,
  isToday,
  isCurrent,
  timeLabel,
}: MealCardProps) {
  const selections = useSelections();
  const trainingDays = useTrainingDays();
  const setSelection = useSetSelection();
  const selection = selections[day][meal.type];
  const isTraining = trainingDays[day];
  const isPast = isToday && isMealPast(meal.type);
  const [collapsed, setCollapsed] = useState(isPast);

  // On mobile, past meals are collapsible
  const mobileCollapsible = isToday && isPast;

  const card = isFixedMeal(meal) ? (
    <FixedMealCard
      meal={meal}
      selection={selection}
      isTraining={isTraining}
      isCurrent={isCurrent}
      isPast={isPast}
      isToday={isToday}
      timeLabel={timeLabel}
      onSelect={(sel) => setSelection(day, meal.type, sel)}
      collapsed={collapsed}
      mobileCollapsible={mobileCollapsible}
      onToggle={() => setCollapsed(!collapsed)}
    />
  ) : (
    <VariableMealCard
      meal={meal}
      day={day}
      selection={selection}
      isCurrent={isCurrent}
      isPast={isPast}
      isToday={isToday}
      timeLabel={timeLabel}
      onSelect={(sel) => setSelection(day, meal.type, sel)}
      collapsed={collapsed}
      mobileCollapsible={mobileCollapsible}
      onToggle={() => setCollapsed(!collapsed)}
    />
  );

  return card;
}

function FixedMealCard({
  meal,
  selection,
  isTraining,
  isCurrent,
  isPast,
  isToday,
  timeLabel,
  onSelect,
  collapsed,
  mobileCollapsible,
  onToggle,
}: {
  meal: FixedMeal;
  selection: MealSelection;
  isTraining: boolean;
  isCurrent: boolean;
  isPast: boolean;
  isToday: boolean;
  timeLabel: string;
  onSelect: (sel: MealSelection) => void;
  collapsed: boolean;
  mobileCollapsible: boolean;
  onToggle: () => void;
}) {
  const showNonTraining =
    !isTraining && meal.type === "media_manana" && meal.nonTrainingOverride;
  const activeOptions = showNonTraining
    ? [meal.nonTrainingOverride!]
    : meal.options;

  const totals = useMemo(
    () => calculateFixedMealTotals(meal, selection, isTraining),
    [meal, selection, isTraining]
  );

  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-4 space-y-3 transition-all",
        isCurrent && "ring-2 ring-orange-400 shadow-lg shadow-orange-100",
        isPast && "opacity-40"
      )}
    >
      {/* Header - clickable on mobile when collapsible */}
      <div
        className={cn(
          "flex items-center gap-2",
          mobileCollapsible && "cursor-pointer md:cursor-default"
        )}
        onClick={mobileCollapsible ? onToggle : undefined}
      >
        <span
          className={cn(
            "w-2.5 h-2.5 rounded-full shrink-0",
            isCurrent ? "bg-orange-500 animate-pulse" : "bg-orange-500"
          )}
        />
        <span className="text-base font-bold text-foreground">{meal.label}</span>
        {isToday && meal.type === "media_manana" && (
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

      {/* Body - hidden on mobile when collapsed, always visible on desktop */}
      <div className={cn(
        mobileCollapsible && collapsed && "hidden md:block"
      )}>
        <div className="space-y-3">
          {/* Supplements */}
          {meal.supplements.length > 0 && (
            <>
              <p className="text-xs font-semibold text-muted-foreground">
                Suplementos
              </p>
              <div className="flex flex-wrap gap-1.5">
                {meal.supplements.map((s) => (
                  <SupplementBadge key={s.id} supplement={s} />
                ))}
              </div>
            </>
          )}

          {/* Divider before note */}
          {meal.optionalNote && (
            <>
              <div className="border-t" />
              <div className="flex items-center gap-1.5">
                <Coffee className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {meal.optionalNote}
                </span>
              </div>
            </>
          )}

          {/* Non-training banner */}
          {showNonTraining && (
            <div className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg">
              Día sin entrenamiento
            </div>
          )}

          {/* Options with radio buttons */}
          <RadioGroup
            value={selection.optionId || activeOptions[0]?.id}
            onValueChange={(id) =>
              onSelect({
                ...selection,
                optionId: id,
                carbIndex: 0,
                proteinIndex: 0,
                proteinSubIndex: 0,
              })
            }
            className="space-y-3"
          >
            {activeOptions.map((opt) => {
              const isSelected =
                (selection.optionId || activeOptions[0]?.id) === opt.id;
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
                  <div className="flex items-center gap-2 mb-2">
                    <RadioGroupItem value={opt.id} />
                    <span className="text-sm font-semibold text-foreground">
                      {opt.label}
                    </span>
                  </div>

                  {/* Carbs */}
                  <div className="space-y-1 ml-6">
                    {opt.carbs.map((c, i) => (
                      <FoodItemRow key={i} food={c} />
                    ))}
                  </div>

                  {/* Proteins */}
                  {opt.protein.options.length > 0 && (
                    <div className="ml-6 mt-2">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        Proteína
                      </p>
                      <div className="space-y-0.5">
                        {opt.protein.options.map((p, i) => {
                          const isProteinSelected =
                            isSelected && (selection.proteinSubIndex ?? 0) === i;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onSelect({ ...selection, proteinSubIndex: i });
                              }}
                              className={cn(
                                "block w-full text-left text-xs px-2 py-1 rounded-md transition-colors",
                                isProteinSelected
                                  ? "bg-orange-100 text-foreground font-medium"
                                  : "text-muted-foreground hover:bg-orange-50"
                              )}
                            >
                              {p.name} {p.quantity}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Extras */}
                  {opt.extras?.map((e, i) => (
                    <div key={i} className="flex items-center gap-2 ml-6 mt-1">
                      {getFoodIcon(e.name, true)}
                      <span className="text-[13px] text-muted-foreground">
                        {e.name} {e.quantity}
                      </span>
                    </div>
                  ))}

                  {/* Warning */}
                  {opt.notes && (
                    <div className="ml-6 mt-2">
                      <WarningBox text={opt.notes} />
                    </div>
                  )}
                </label>
              );
            })}
          </RadioGroup>

          {/* Totales kcal / precio */}
          <MealTotalsBadge totals={totals} />
        </div>
      </div>
    </div>
  );
}

function VariableMealCard({
  meal,
  day,
  selection,
  isCurrent,
  isPast,
  isToday,
  timeLabel,
  onSelect,
  collapsed,
  mobileCollapsible,
  onToggle,
}: {
  meal: VariableMeal;
  day: DayOfWeek;
  selection: MealSelection;
  isCurrent: boolean;
  isPast: boolean;
  isToday: boolean;
  timeLabel: string;
  onSelect: (sel: MealSelection) => void;
  collapsed: boolean;
  mobileCollapsible: boolean;
  onToggle: () => void;
}) {
  const dayData = meal.days.find((d) => d.day === day);
  if (!dayData) return null;

  const carbIndex = selection.carbIndex ?? 0;
  const proteinIndex = selection.proteinIndex ?? 0;

  const totals = useMemo(
    () => calculateVariableMealTotals(meal, day, selection),
    [meal, day, selection]
  );

  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-4 space-y-3 transition-all",
        isCurrent && "ring-2 ring-orange-400 shadow-lg shadow-orange-100",
        isPast && "opacity-40"
      )}
    >
      {/* Header - clickable on mobile when collapsible */}
      <div
        className={cn(
          "flex items-center gap-2",
          mobileCollapsible && "cursor-pointer md:cursor-default"
        )}
        onClick={mobileCollapsible ? onToggle : undefined}
      >
        <span
          className={cn(
            "w-2.5 h-2.5 rounded-full shrink-0",
            isCurrent ? "bg-orange-500 animate-pulse" : "bg-orange-500"
          )}
        />
        <span className="text-base font-bold text-foreground">{meal.label}</span>
        {isToday && (
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

      {/* Body - hidden on mobile when collapsed, always visible on desktop */}
      <div className={cn(
        mobileCollapsible && collapsed && "hidden md:block"
      )}>
        <div className="space-y-3">
          {/* Supplements */}
          {meal.supplements.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {meal.supplements.map((s) => (
                <SupplementBadge key={s.id} supplement={s} />
              ))}
            </div>
          )}

          {/* Carbohidratos */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Carbohidrato
            </p>
            <RadioGroup
              value={String(carbIndex)}
              onValueChange={(v) =>
                onSelect({ ...selection, carbIndex: parseInt(v) })
              }
              className="space-y-1"
            >
              {dayData.carbOptions.map((carb, i) => (
                <label
                  key={i}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors",
                    carbIndex === i
                      ? "bg-orange-50"
                      : "hover:bg-accent"
                  )}
                >
                  <RadioGroupItem value={String(i)} />
                  <FoodItemRow food={carb} />
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="border-t" />

          {/* Proteína - grupo */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Proteína
            </p>
            <RadioGroup
              value={String(proteinIndex)}
              onValueChange={(v) =>
                onSelect({
                  ...selection,
                  proteinIndex: parseInt(v),
                  proteinSubIndex: 0,
                })
              }
              className="space-y-1"
            >
              {dayData.proteinOptions.map((pGroup, i) => (
                <label
                  key={i}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors",
                    proteinIndex === i ? "bg-orange-50" : "hover:bg-accent"
                  )}
                >
                  <RadioGroupItem value={String(i)} className="shrink-0" />
                  <span className="text-[13px] text-muted-foreground">
                    {pGroup.options[0]?.quantity}
                  </span>
                </label>
              ))}
            </RadioGroup>

            {/* Proteína - sub-selección (fuera del RadioGroup) */}
            <ProteinSubSelector
              options={dayData.proteinOptions[proteinIndex]?.options ?? []}
              selectedIndex={selection.proteinSubIndex ?? 0}
              onSelect={(j) =>
                onSelect({ ...selection, proteinSubIndex: j })
              }
            />
          </div>

          {/* Extras */}
          {dayData.extras && dayData.extras.length > 0 && (
            <>
              <div className="border-t" />
              <div className="space-y-1">
                {dayData.extras.map((e, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {getFoodIcon(e.name, true)}
                    <span className="text-[13px] text-muted-foreground">
                      {e.name} {e.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Warning */}
          {dayData.notes && <WarningBox text={dayData.notes} />}

          {/* Totales kcal / precio */}
          <MealTotalsBadge totals={totals} />
        </div>
      </div>
    </div>
  );
}
