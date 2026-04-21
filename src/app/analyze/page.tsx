"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Upload,
  Loader2,
  Flame,
  ScanLine,
  AlertTriangle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MEAL_LABELS } from "@/data/recipes";
import { targetFor, kcalFit } from "@/data/meal-targets";
import type { MealType } from "@/types/diet";

interface AnalysisItem {
  name: string;
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Analysis {
  items: AnalysisItem[];
  total: { kcal: number; protein: number; carbs: number; fat: number };
  confidence: "alta" | "media" | "baja";
  mealSuggestion: MealType;
  notes: string;
}

const CONFIDENCE_COLOR: Record<Analysis["confidence"], string> = {
  alta: "bg-green-100 text-green-700",
  media: "bg-yellow-100 text-yellow-800",
  baja: "bg-red-100 text-red-700",
};

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function resizeImage(file: File, maxDim = 1280): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  return new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob ?? file),
      "image/jpeg",
      0.85
    );
  });
}

export default function AnalyzePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dayType, setDayType] = useState<"training" | "rest">("training");

  const handleFile = (f: File) => {
    setFile(f);
    setAnalysis(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setAnalysis(null);
    setError(null);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const resized = await resizeImage(file);
      const asFile = new File([resized], file.name, { type: "image/jpeg" });
      const base64 = await fileToBase64(asFile);
      const res = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mimeType: "image/jpeg" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al analizar");
      setAnalysis(data as Analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const target = analysis ? targetFor(analysis.mealSuggestion, dayType) : null;
  const fit = target && analysis ? kcalFit(analysis.total.kcal, target) : null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 md:pb-6">
      <div className="px-4 py-6 md:px-8 max-w-3xl mx-auto space-y-5">
        <div>
          <h1 className="text-[28px] font-bold text-foreground flex items-center gap-2">
            <ScanLine className="h-7 w-7 text-orange-500" />
            Analizar plato
          </h1>
          <p className="text-sm text-muted-foreground">
            Sube una foto y la IA estima kcal y macros
          </p>
        </div>

        {!preview && (
          <Card>
            <CardContent className="p-6 space-y-3">
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
              <Button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full bg-orange-500 hover:bg-orange-600 h-12"
              >
                <Camera className="h-5 w-5 mr-2" />
                Hacer foto
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full h-12"
              >
                <Upload className="h-5 w-5 mr-2" />
                Subir desde galería
              </Button>
              <p className="text-xs text-muted-foreground text-center pt-2">
                Consejo: enfoca el plato completo con buena luz. Referencias
                visuales (tenedor, vaso) mejoran la precisión.
              </p>
            </CardContent>
          </Card>
        )}

        {preview && (
          <Card className="overflow-hidden">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Plato"
                className="w-full max-h-[400px] object-cover"
              />
              <button
                onClick={reset}
                className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
                aria-label="Quitar foto"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <CardContent className="p-4 space-y-3">
              {!analysis && !loading && (
                <Button
                  onClick={analyze}
                  className="w-full bg-orange-500 hover:bg-orange-600 h-11"
                >
                  <ScanLine className="h-4 w-4 mr-2" />
                  Analizar con IA
                </Button>
              )}
              {loading && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analizando con Claude Vision…
                </div>
              )}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 text-red-700 text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {analysis && (
          <>
            {/* Totales */}
            <Card className="border-orange-200 bg-orange-50/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    Total estimado
                  </span>
                  <span
                    className={cn(
                      "text-[10px] uppercase px-1.5 py-0.5 rounded",
                      CONFIDENCE_COLOR[analysis.confidence]
                    )}
                  >
                    Confianza {analysis.confidence}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-orange-600">
                    {analysis.total.kcal}
                  </span>
                  <span className="text-sm text-muted-foreground">kcal</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white rounded-md p-2">
                    <div className="text-muted-foreground">Proteína</div>
                    <div className="font-bold text-base text-foreground">
                      {analysis.total.protein}g
                    </div>
                  </div>
                  <div className="bg-white rounded-md p-2">
                    <div className="text-muted-foreground">Hidratos</div>
                    <div className="font-bold text-base text-foreground">
                      {analysis.total.carbs}g
                    </div>
                  </div>
                  <div className="bg-white rounded-md p-2">
                    <div className="text-muted-foreground">Grasa</div>
                    <div className="font-bold text-base text-foreground">
                      {analysis.total.fat}g
                    </div>
                  </div>
                </div>

                {/* Comparación con objetivo */}
                <div className="pt-2 border-t border-orange-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Tipo sugerido:
                    </span>
                    <span className="font-semibold">
                      {MEAL_LABELS[analysis.mealSuggestion]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Día:</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setDayType("training")}
                        className={cn(
                          "px-2 py-0.5 rounded text-[11px]",
                          dayType === "training"
                            ? "bg-orange-500 text-white"
                            : "bg-white border border-border text-muted-foreground"
                        )}
                      >
                        Entreno
                      </button>
                      <button
                        onClick={() => setDayType("rest")}
                        className={cn(
                          "px-2 py-0.5 rounded text-[11px]",
                          dayType === "rest"
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-border text-muted-foreground"
                        )}
                      >
                        Descanso
                      </button>
                    </div>
                  </div>
                  {target && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Objetivo {MEAL_LABELS[analysis.mealSuggestion]}:
                      </span>
                      <span
                        className={cn(
                          "font-semibold px-1.5 py-0.5 rounded",
                          fit === "ok" && "bg-green-100 text-green-700",
                          fit === "under" && "bg-blue-100 text-blue-700",
                          fit === "over" && "bg-red-100 text-red-700"
                        )}
                      >
                        {target.min}–{target.max} kcal{" "}
                        {fit === "ok" && "✓"}
                        {fit === "under" && "↓"}
                        {fit === "over" && "↑"}
                      </span>
                    </div>
                  )}
                  {!target && (
                    <p className="text-muted-foreground italic">
                      Esta comida no aplica en día de{" "}
                      {dayType === "training" ? "entreno" : "descanso"}.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Desglose */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Desglose por alimento</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="divide-y divide-border">
                  {analysis.items.map((it, i) => (
                    <li key={i} className="py-2.5 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm capitalize">
                          {it.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ≈ {it.grams}g · P{it.protein}g · C{it.carbs}g · G
                          {it.fat}g
                        </div>
                      </div>
                      <div className="text-sm font-bold text-orange-600 shrink-0">
                        {it.kcal} kcal
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {analysis.notes && (
              <div className="text-xs text-muted-foreground italic px-1">
                {analysis.notes}
              </div>
            )}

            <Button onClick={reset} variant="outline" className="w-full">
              Analizar otra foto
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
