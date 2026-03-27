"use client";

import { ProductCard } from "./product-card";
import { useMercadonaProducts } from "@/hooks/use-mercadona-products";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  categoryId: number | null;
}

export function ProductGrid({ categoryId }: ProductGridProps) {
  const { category, isLoading, isError } = useMercadonaProducts(categoryId);

  if (!categoryId) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Selecciona una categoría para ver productos
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        Error al cargar productos. Inténtalo de nuevo.
      </div>
    );
  }

  // Mercadona API returns nested subcategories
  const subcategories: { name: string; products: Array<{ id: string; display_name: string; thumbnail: string; packaging: string; price_instructions: { unit_price: string; reference_price: string; reference_format: string } }> }[] =
    category?.categories || [];

  const allProducts = subcategories.flatMap((sc: { products: Array<{ id: string; display_name: string; thumbnail: string; packaging: string; price_instructions: { unit_price: string; reference_price: string; reference_format: string } }> }) => sc.products || []);

  if (allProducts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No se encontraron productos en esta categoría
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {subcategories.map((sub) => (
        <div key={sub.name}>
          {subcategories.length > 1 && (
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">
              {sub.name} ({sub.products?.length || 0})
            </h3>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {(sub.products || []).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
