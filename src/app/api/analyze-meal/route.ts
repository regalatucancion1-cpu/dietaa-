import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `Eres un nutricionista deportivo experto con visión por ordenador, especializado en analizar fotos de platos para estimar kcal y macros con la máxima precisión posible.

Reglas de análisis:
1. Identifica CADA alimento visible. Si algo está oculto parcialmente, estimalo a ojo.
2. Estima la cantidad en gramos (o ml para líquidos, unidades para piezas). Usa referencias visuales: plato estándar ≈25 cm, tenedor ≈20 cm, lata de bebida ≈12 cm, mano humana ≈18 cm.
3. Distingue crudo vs cocinado (el arroz cocido pesa ~2.5× su peso crudo, la pasta ~2.2×).
4. Incluye aceites y grasas no obvias: si ves brillo en verduras, algo rehogado, mayonesa, salsas. Estima el aceite visible con criterio.
5. Separa carnes magras vs grasas (pechuga pollo 110 kcal/100g vs muslo 215), pescado blanco (85 kcal/100g) vs azul (200 kcal/100g).
6. Para cada item calcula: gramos, kcal, proteína (g), hidratos (g), grasa (g).
7. Sé conservador: mejor sobreestimar kcal 5% que quedarte corto.
8. Si la foto está mal iluminada o no se ve bien el plato, baja la confianza a "baja".

Devuelve SIEMPRE un objeto JSON válido, sin markdown ni bloques de código, sin texto adicional.`;

const USER_PROMPT = `Analiza este plato y devuelve EXACTAMENTE un JSON con esta estructura:

{
  "items": [
    {
      "name": "string (nombre del alimento en español)",
      "grams": number,
      "kcal": number,
      "protein": number,
      "carbs": number,
      "fat": number
    }
  ],
  "total": {
    "kcal": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "confidence": "alta" | "media" | "baja",
  "mealSuggestion": "desayuno" | "comida" | "pre_entreno" | "merienda" | "cena",
  "notes": "observaciones breves en español, 1-2 frases"
}

Devuelve SOLO el JSON.`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "ANTHROPIC_API_KEY no configurada. Añádela en Vercel → Settings → Environment Variables.",
        },
        { status: 500 }
      );
    }

    const { image, mimeType } = await req.json();
    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "Imagen no válida" },
        { status: 400 }
      );
    }

    const allowedMime = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ] as const;
    type AllowedMime = (typeof allowedMime)[number];
    const mt: AllowedMime = (
      allowedMime.includes(mimeType as AllowedMime) ? mimeType : "image/jpeg"
    ) as AllowedMime;

    const anthropic = new Anthropic({ apiKey });

    const resp = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mt, data: image },
            },
            { type: "text", text: USER_PROMPT },
          ],
        },
      ],
    });

    const text = resp.content
      .filter((c): c is Anthropic.TextBlock => c.type === "text")
      .map((c) => c.text)
      .join("")
      .trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Respuesta sin JSON válido", raw: text },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
