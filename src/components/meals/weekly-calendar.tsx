"use client";

import { useState, useEffect, useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import { Flame, Euro } from "lucide-react";
import { MealCard } from "./meal-card";
import { DIET_PLAN } from "@/data/diet-plan";
import {
  useTrainingDays,
  useToggleTrainingDay,
  useSelections,
} from "@/hooks/use-meal-selections";
import { getCurrentDay, getCurrentMeal, getMealTimeLabel } from "@/lib/time-utils";
import { calculateDayTotals, getActiveVariant } from "@/lib/meal-calculator";
import { cn } from "@/lib/utils";
import {
  DAYS,
  DAY_LABELS,
  MEAL_ORDER,
  type DayOfWeek,
  type MealType,
} from "@/types/diet";

const DAY_SHORT: Record<DayOfWeek, string> = {
  lunes: "Lun",
  martes: "Mar",
  miercoles: "Mié",
  jueves: "Jue",
  viernes: "Vie",
  sabado: "Sáb",
  domingo: "Dom",
};

function DaySelector({
  selectedDay,
  today,
  onSelect,
}: {
  selectedDay: DayOfWeek;
  today: DayOfWeek;
  onSelect: (day: DayOfWeek) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 w-full overflow-x-auto py-1 px-1 no-scrollbar">
      {DAYS.map((day) => {
        const isSelected = day === selectedDay;
        const isToday = day === today;
        return (
          <button
            key={day}
            onClick={() => onSelect(day)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-[13px] font-medium transition-all border shrink-0",
              isSelected
                ? "bg-orange-500 border-orange-500 text-white font-bold"
                : "bg-white border-border text-muted-foreground hover:border-orange-200"
            )}
          >
            {DAY_SHORT[day]}
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                isSelected ? "bg-white" : isToday ? "bg-orange-500" : "bg-border"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

function DayHeader({
  day,
  isToday,
  isTraining,
  onToggleTraining,
  dayKcal,
  dayPrice,
}: {
  day: DayOfWeek;
  isToday: boolean;
  isTraining: boolean;
  onToggleTraining: () => void;
  dayKcal: number;
  dayPrice: number;
}) {
  return (
    <div className="rounded-xl border bg-white px-4 py-3 w-full space-y-2">
      <div className="flex items-center">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span className="text-lg font-bold text-foreground">
            {DAY_LABELS[day]}
          </span>
          {isToday && (
            <span className="text-[11px] font-semibold text-white bg-orange-500 rounded-full px-2.5 py-0.5">
              HOY
            </span>
          )}
        </div>
        <span className="flex-1" />
        <div className="flex items-center gap-3">
          <Switch checked={isTraining} onCheckedChange={onToggleTraining} />
          <span className="text-[13px] font-semibold text-foreground">
            Entreno
          </span>
        </div>
      </div>
      {dayKcal > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-orange-50 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-bold text-foreground">
              ~{dayKcal.toLocaleString("es-ES")} kcal
            </span>
          </div>
          <span className="text-muted-foreground">·</span>
          <div className="flex items-center gap-1.5">
            <Euro className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-bold text-foreground">
              ~{dayPrice.toFixed(2)} €
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function WeeklyCalendar() {
  const [today, setToday] = useState<DayOfWeek>("lunes");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("lunes");
  const [currentMeal, setCurrentMeal] = useState<MealType | null>(null);
  const trainingDays = useTrainingDays();
  const toggleTrainingDay = useToggleTrainingDay();
  const selections = useSelections();

  useEffect(() => {
    const current = getCurrentDay();
    setToday(current);
    setSelectedDay(current);
    setCurrentMeal(getCurrentMeal());
    const interval = setInterval(() => {
      setToday(getCurrentDay());
      setCurrentMeal(getCurrentMeal());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const isToday = selectedDay === today;
  const isTraining = trainingDays[selectedDay];

  const dayTotals = useMemo(
    () => calculateDayTotals(selections[selectedDay], isTraining),
    [selectedDay, selections, isTraining]
  );

  const visibleMeals = MEAL_ORDER.filter((mealType) => {
    const meal = DIET_PLAN[mealType];
    return !!getActiveVariant(meal, isTraining);
  });

  return (
    <div className="space-y-5">
      <DaySelector
        selectedDay={selectedDay}
        today={today}
        onSelect={setSelectedDay}
      />

      <DayHeader
        day={selectedDay}
        isToday={isToday}
        isTraining={isTraining}
        onToggleTraining={() => toggleTrainingDay(selectedDay)}
        dayKcal={dayTotals.kcal}
        dayPrice={dayTotals.price}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleMeals.map((mealType) => {
          const meal = DIET_PLAN[mealType];
          return (
            <MealCard
              key={mealType}
              meal={meal}
              day={selectedDay}
              isTraining={isTraining}
              selection={selections[selectedDay][mealType]}
              isToday={isToday}
              isCurrent={isToday && currentMeal === mealType}
              timeLabel={getMealTimeLabel(mealType)}
            />
          );
        })}
      </div>
    </div>
  );
}
