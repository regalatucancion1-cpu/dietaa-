"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Dumbbell,
  ShoppingCart,
  Store,
  UtensilsCrossed,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Mi Dieta", icon: CalendarDays },
  { href: "/gym", label: "Gym", icon: Dumbbell },
  { href: "/mercadona", label: "Mercadona", icon: Store },
  { href: "/shopping-list", label: "Lista", icon: ShoppingCart },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop navbar */}
      <nav className="hidden md:flex items-center justify-between border-b bg-white px-6 h-14 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-orange-500" />
            <span className="font-bold text-lg">Christian</span>
          </Link>

          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile top bar + bottom nav */}
      <div className="md:hidden">
        <div className="flex items-center border-b bg-white px-4 h-12 shrink-0">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-orange-500" />
            <span className="font-bold">Christian</span>
          </div>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-white">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors",
                  isActive ? "text-orange-600" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
