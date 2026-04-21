"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useGymStore,
  setsForExercise,
  personalRecords,
  MUSCLE_GROUPS,
  muscleGroupLabel,
  type MuscleGroup,
  type WorkoutSet,
} from "@/hooks/use-gym";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dumbbell,
  Plus,
  Trash2,
  TrendingUp,
  Weight,
  Repeat,
  Calendar,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d.toString().padStart(2, "0")}/${m.toString().padStart(2, "0")}/${y}`;
}

function dayLabel(iso: string) {
  const now = new Date();
  const today = todayIso();
  const yest = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
  if (iso === today) return "Hoy";
  if (iso === yest) return "Ayer";
  return formatDate(iso);
}

export default function GymPage() {
  const exercises = useGymStore((s) => s.exercises);
  const sets = useGymStore((s) => s.sets);
  const addExercise = useGymStore((s) => s.addExercise);
  const deleteExercise = useGymStore((s) => s.deleteExercise);
  const addSet = useGymStore((s) => s.addSet);
  const deleteSet = useGymStore((s) => s.deleteSet);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGroup, setNewGroup] = useState<MuscleGroup>("pecho");

  const [date, setDate] = useState(todayIso());
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rir, setRir] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!selectedId && exercises.length > 0) {
      setSelectedId(exercises[0].id);
    }
  }, [exercises, selectedId]);

  const selected = exercises.find((e) => e.id === selectedId);
  const exerciseSets = useMemo(
    () => (selectedId ? setsForExercise(sets, selectedId) : []),
    [sets, selectedId]
  );
  const prs = useMemo(() => personalRecords(exerciseSets), [exerciseSets]);

  const sessions = useMemo(() => {
    const grouped = new Map<string, WorkoutSet[]>();
    for (const s of exerciseSets) {
      const arr = grouped.get(s.date) ?? [];
      arr.push(s);
      grouped.set(s.date, arr);
    }
    return Array.from(grouped.entries()).map(([date, arr]) => ({
      date,
      sets: arr.sort((a, b) => a.createdAt - b.createdAt),
    }));
  }, [exerciseSets]);

  const onAddExercise = () => {
    if (!newName.trim()) return;
    const id = addExercise(newName.trim(), newGroup);
    setSelectedId(id);
    setNewName("");
    setShowAddExercise(false);
  };

  const onAddSet = () => {
    if (!selectedId) return;
    const w = parseFloat(weight.replace(",", "."));
    const r = parseInt(reps);
    if (!isFinite(w) || !isFinite(r) || r <= 0) return;
    addSet({
      exerciseId: selectedId,
      date,
      weight: w,
      reps: r,
      rir: rir ? parseInt(rir) : undefined,
      notes: notes.trim() || undefined,
    });
    setWeight("");
    setReps("");
    setRir("");
    setNotes("");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 md:pb-6">
      <div className="px-4 py-6 md:px-8 max-w-6xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-foreground flex items-center gap-2">
              <Dumbbell className="h-7 w-7 text-orange-500" />
              Gym
            </h1>
            <p className="text-sm text-muted-foreground">
              Registro de series y progresión
            </p>
          </div>
          <Button
            onClick={() => setShowAddExercise(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ejercicio
          </Button>
        </div>

        {/* Exercise chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedId(ex.id)}
              className={cn(
                "flex-shrink-0 flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg border text-left text-sm transition-colors",
                selectedId === ex.id
                  ? "bg-orange-500 text-white border-orange-500 font-semibold"
                  : "bg-white border-border text-muted-foreground hover:border-orange-200"
              )}
            >
              <span className="font-medium whitespace-nowrap">{ex.name}</span>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-wide",
                  selectedId === ex.id ? "text-white/90" : "text-muted-foreground/70"
                )}
              >
                {muscleGroupLabel(ex.muscleGroup)}
              </span>
            </button>
          ))}
        </div>

        {showAddExercise && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm">Nuevo ejercicio</CardTitle>
              <button
                onClick={() => setShowAddExercise(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                type="text"
                placeholder="Nombre del ejercicio"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <select
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value as MuscleGroup)}
                className="w-full px-3 py-2 rounded-md border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                {MUSCLE_GROUPS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
              <Button
                onClick={onAddExercise}
                disabled={!newName.trim()}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Añadir
              </Button>
            </CardContent>
          </Card>
        )}

        {selected && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                    <Weight className="h-3.5 w-3.5" />
                    PR peso
                  </div>
                  <div className="text-xl font-bold">
                    {prs.maxWeight.toFixed(1)}
                    <span className="text-sm text-muted-foreground ml-1">kg</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    PR volumen
                  </div>
                  <div className="text-xl font-bold">
                    {prs.maxVolume.toFixed(0)}
                    <span className="text-sm text-muted-foreground ml-1">kg·reps</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                    <Repeat className="h-3.5 w-3.5" />
                    Series totales
                  </div>
                  <div className="text-xl font-bold">{exerciseSets.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Add set form */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Añadir serie — {selected.name}</span>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar ejercicio "${selected.name}" y todas sus series?`)) {
                        deleteExercise(selected.id);
                        setSelectedId(null);
                      }
                    }}
                    className="text-muted-foreground hover:text-red-600"
                    title="Eliminar ejercicio"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs text-muted-foreground space-y-1">
                    Fecha
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </label>
                  <label className="text-xs text-muted-foreground space-y-1">
                    Peso (kg)
                    <input
                      type="number"
                      step="0.5"
                      inputMode="decimal"
                      placeholder="p. ej. 60"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs text-muted-foreground space-y-1">
                    Reps
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="p. ej. 10"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </label>
                  <label className="text-xs text-muted-foreground space-y-1">
                    RIR (opcional)
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="p. ej. 2"
                      value={rir}
                      onChange={(e) => setRir(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Notas (opcional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <Button
                  onClick={onAddSet}
                  disabled={!weight || !reps}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Añadir serie
                </Button>
              </CardContent>
            </Card>

            {/* History */}
            {sessions.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 text-sm">
                Aún no hay series registradas para {selected.name}.
              </div>
            ) : (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  Historial
                </h2>
                {sessions.map((session) => (
                  <Card key={session.date}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        {dayLabel(session.date)}
                        <span className="ml-auto text-xs text-muted-foreground font-normal">
                          {session.sets.length} series
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1.5">
                        {session.sets.map((s, i) => (
                          <li
                            key={s.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="w-6 text-xs font-semibold text-muted-foreground">
                              #{i + 1}
                            </span>
                            <span className="font-semibold">{s.weight}kg</span>
                            <span className="text-muted-foreground">×</span>
                            <span className="font-semibold">{s.reps}</span>
                            {s.rir !== undefined && (
                              <span className="text-[11px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                                RIR {s.rir}
                              </span>
                            )}
                            {s.notes && (
                              <span className="text-xs text-muted-foreground truncate italic">
                                {s.notes}
                              </span>
                            )}
                            <button
                              onClick={() => deleteSet(s.id)}
                              className="ml-auto text-muted-foreground hover:text-red-600 shrink-0"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {!selected && !showAddExercise && (
          <div className="text-center text-muted-foreground py-12 text-sm">
            No hay ejercicios. Añade uno para empezar.
          </div>
        )}
      </div>
    </div>
  );
}
