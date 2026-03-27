"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    display_name: string;
    thumbnail: string;
    packaging: string;
    price_instructions: {
      unit_price: string;
      reference_price: string;
      reference_format: string;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      <div className="aspect-square relative bg-white p-2">
        <Image
          src={product.thumbnail}
          alt={product.display_name}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 50vw, 200px"
          unoptimized
        />
      </div>
      <CardContent className="p-3 space-y-1">
        <h3 className="text-sm font-medium leading-tight line-clamp-2">
          {product.display_name}
        </h3>
        <p className="text-xs text-muted-foreground">{product.packaging}</p>
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-lg font-bold text-orange-600">
              {product.price_instructions.unit_price} €
            </p>
            <p className="text-[10px] text-muted-foreground">
              {product.price_instructions.reference_price} €/
              {product.price_instructions.reference_format}
            </p>
          </div>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
            <ShoppingCart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
