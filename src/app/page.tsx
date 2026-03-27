import { WeeklyCalendar } from "@/components/meals/weekly-calendar";
import { NUTRITION_RULES } from "@/data/diet-plan";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="px-4 py-6 md:px-8 lg:px-8 max-w-6xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-foreground">
              Plan Semanal
            </h1>
            <p className="text-sm text-muted-foreground">
              Selecciona tus opciones para cada comida del día
            </p>
          </div>
        </div>

        <WeeklyCalendar />

        {/* Nutrition rules */}
        <section>
          <details className="group">
            <summary className="cursor-pointer text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              Reglas nutricionales
            </summary>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {NUTRITION_RULES.map((rule, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-orange-500 shrink-0">•</span>
                  {rule}
                </li>
              ))}
            </ul>
          </details>
        </section>
      </div>
    </div>
  );
}
