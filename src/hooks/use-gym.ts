"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type MuscleGroup =
  | "pecho"
  | "espalda"
  | "hombro"
  | "biceps"
  | "triceps"
  | "cuadriceps"
  | "femoral"
  | "gluteo"
  | "gemelo"
  | "abdomen"
  | "core"
  | "otro";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  createdAt: number;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  date: string; // ISO yyyy-mm-dd
  weight: number;
  reps: number;
  rir?: number;
  notes?: string;
  createdAt: number;
}

interface GymStore {
  exercises: Exercise[];
  sets: WorkoutSet[];
  addExercise: (name: string, muscleGroup: MuscleGroup) => string;
  deleteExercise: (id: string) => void;
  renameExercise: (id: string, name: string, muscleGroup: MuscleGroup) => void;
  addSet: (set: Omit<WorkoutSet, "id" | "createdAt">) => void;
  deleteSet: (id: string) => void;
}

const DEFAULT_EXERCISES: Exercise[] = [
  { id: "press-banca", name: "Press banca", muscleGroup: "pecho", createdAt: 0 },
  { id: "sentadilla", name: "Sentadilla", muscleGroup: "cuadriceps", createdAt: 0 },
  { id: "peso-muerto", name: "Peso muerto", muscleGroup: "espalda", createdAt: 0 },
  { id: "dominadas", name: "Dominadas", muscleGroup: "espalda", createdAt: 0 },
  { id: "press-militar", name: "Press militar", muscleGroup: "hombro", createdAt: 0 },
  { id: "curl-biceps", name: "Curl bíceps", muscleGroup: "biceps", createdAt: 0 },
  { id: "hip-thrust", name: "Hip thrust", muscleGroup: "gluteo", createdAt: 0 },
];

function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export const useGymStore = create<GymStore>()(
  persist(
    (set) => ({
      exercises: DEFAULT_EXERCISES,
      sets: [],
      addExercise: (name, muscleGroup) => {
        const id = uid("ex-");
        set((state) => ({
          exercises: [
            ...state.exercises,
            { id, name, muscleGroup, createdAt: Date.now() },
          ],
        }));
        return id;
      },
      deleteExercise: (id) =>
        set((state) => ({
          exercises: state.exercises.filter((e) => e.id !== id),
          sets: state.sets.filter((s) => s.exerciseId !== id),
        })),
      renameExercise: (id, name, muscleGroup) =>
        set((state) => ({
          exercises: state.exercises.map((e) =>
            e.id === id ? { ...e, name, muscleGroup } : e
          ),
        })),
      addSet: (data) =>
        set((state) => ({
          sets: [
            ...state.sets,
            { ...data, id: uid("set-"), createdAt: Date.now() },
          ],
        })),
      deleteSet: (id) =>
        set((state) => ({
          sets: state.sets.filter((s) => s.id !== id),
        })),
    }),
    {
      name: "gym-christian-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

export function useHydrateGymStore() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    useGymStore.persist.rehydrate();
    setHydrated(true);
  }, []);
  return hydrated;
}

export const MUSCLE_GROUPS: { id: MuscleGroup; label: string }[] = [
  { id: "pecho", label: "Pecho" },
  { id: "espalda", label: "Espalda" },
  { id: "hombro", label: "Hombro" },
  { id: "biceps", label: "Bíceps" },
  { id: "triceps", label: "Tríceps" },
  { id: "cuadriceps", label: "Cuádriceps" },
  { id: "femoral", label: "Femoral" },
  { id: "gluteo", label: "Glúteo" },
  { id: "gemelo", label: "Gemelo" },
  { id: "abdomen", label: "Abdomen" },
  { id: "core", label: "Core" },
  { id: "otro", label: "Otro" },
];

export function muscleGroupLabel(g: MuscleGroup): string {
  return MUSCLE_GROUPS.find((m) => m.id === g)?.label ?? g;
}

export function setsForExercise(sets: WorkoutSet[], exerciseId: string) {
  return sets
    .filter((s) => s.exerciseId === exerciseId)
    .sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return b.createdAt - a.createdAt;
    });
}

export function personalRecords(sets: WorkoutSet[]) {
  if (sets.length === 0) return { maxWeight: 0, maxVolume: 0 };
  let maxWeight = 0;
  let maxVolume = 0;
  for (const s of sets) {
    if (s.weight > maxWeight) maxWeight = s.weight;
    const vol = s.weight * s.reps;
    if (vol > maxVolume) maxVolume = vol;
  }
  return { maxWeight, maxVolume };
}
