"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MERCADONA_CATEGORIES } from "@/data/mercadona-categories";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function CategoryNav({ selectedId, onSelect }: CategoryNavProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-0.5 p-2">
        {MERCADONA_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left transition-colors",
              selectedId === cat.id
                ? "bg-orange-50 text-orange-700 font-medium dark:bg-orange-950 dark:text-orange-400"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <span>{cat.icon}</span>
            <span className="truncate">{cat.name}</span>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
