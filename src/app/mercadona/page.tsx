"use client";

import { useState } from "react";
import { CategoryNav } from "@/components/mercadona/category-nav";
import { ProductGrid } from "@/components/mercadona/product-grid";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { MERCADONA_CATEGORIES } from "@/data/mercadona-categories";

export default function MercadonaPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    MERCADONA_CATEGORIES[0]?.id ?? null
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const selectedName = MERCADONA_CATEGORIES.find(
    (c) => c.id === selectedCategory
  )?.name;

  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-56 border-r shrink-0">
        <div className="p-3 border-b">
          <h2 className="font-bold text-sm">Categorías</h2>
        </div>
        <CategoryNav
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <header className="border-b px-4 py-3 flex items-center gap-3">
          {/* Mobile category button */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              className="md:hidden"
              render={<Button variant="outline" size="sm" />}
            >
              <Menu className="h-4 w-4 mr-1" />
              Categorías
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-3 border-b">
                <h2 className="font-bold text-sm">Categorías</h2>
              </div>
              <CategoryNav
                selectedId={selectedCategory}
                onSelect={(id) => {
                  setSelectedCategory(id);
                  setSheetOpen(false);
                }}
              />
            </SheetContent>
          </Sheet>

          <div>
            <h1 className="text-xl font-bold">Mercadona</h1>
            {selectedName && (
              <p className="text-sm text-muted-foreground">{selectedName}</p>
            )}
          </div>
        </header>

        <div className="p-4">
          <ProductGrid categoryId={selectedCategory} />
        </div>
      </div>
    </div>
  );
}
