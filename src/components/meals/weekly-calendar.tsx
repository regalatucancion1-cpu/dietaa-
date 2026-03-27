"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { MealCard } from "./meal-card";
import { DIET_PLAN } from "@/data/diet-plan";
import {
  useTrainingDays,
  useToggleTrainingDay,
} from "@/hooks/use-meal-selections";
import { getCurrentDay, getCurrentMeal, getMealTimeLabel } from "@/lib/time-utils";
import { cn } from "@/lib/utils";
import {
  DAYS,
  DAY_LABELS,
  MEAL_ORDER,
  type DayOfWeek,
  type MealType,
  type Meal,
} from "@/types/diet";

function getMeal(mealType: MealType): Meal {
  if (mealType in DIET_PLAN.fixed) {
    return DIET_PLAN.fixed[mealType as keyof typeof DIET_PLAN.fixed];
  }
  return DIET_PLAN.variable[mealType as keyof typeof DIET_PLAN.variable];
}

const DAY_SHORT_LABELS: Record<DayOfWeek, string> = {
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
            {DAY_SHORT_LABELS[day]}
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                isSelected
                  ? "bg-white"
                  : isToday
                    ? "bg-orange-500"
                    : "bg-border"
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
}: {
  day: DayOfWeek;
  isToday: boolean;
  isTraining: boolean;
  onToggleTraining: () => void;
}) {
  return (
    <div className="flex items-center rounded-xl border bg-white px-4 py-3 w-full">
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
        <Switch
          checked={isTraining}
          onCheckedChange={onToggleTraining}
        />
        <span className="text-[13px] font-semibold text-foreground">
          Entreno
        </span>
      </div>
    </div>
  );
}

function MealSection({
  mealType,
  day,
  isToday,
  currentMeal,
}: {
  mealType: MealType;
  day: DayOfWeek;
  isToday: boolean;
  currentMeal: MealType | null;
}) {
  const meal = getMeal(mealType);
  return (
    <MealCard
      meal={meal}
      day={day}
      isToday={isToday}
      isCurrent={isToday && currentMeal === mealType}
      timeLabel={getMealTimeLabel(mealType)}
    />
  );
}

export function WeeklyCalendar() {
  const [today, setToday] = useState<DayOfWeek>("lunes");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("lunes");
  const [currentMeal, setCurrentMeal] = useState<MealType | null>(null);
  const trainingDays = useTrainingDays();
  const toggleTrainingDay = useToggleTrainingDay();

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

  return (
    <div className="space-y-5">
      {/* Day Selector Pills */}
      <DaySelector
        selectedDay={selectedDay}
        today={today}
        onSelect={setSelectedDay}
      />

      {/* Day Header Bar */}
      <DayHeader
        day={selectedDay}
        isToday={isToday}
        isTraining={trainingDays[selectedDay]}
        onToggleTraining={() => toggleTrainingDay(selectedDay)}
      />

      {/* Meals - 2 columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MEAL_ORDER.map((mealType) => (
          <MealSection
            key={mealType}
            mealType={mealType}
            day={selectedDay}
            isToday={isToday}
            currentMeal={currentMeal}
          />
        ))}
      </div>
    </div>
  );
}
