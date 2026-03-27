"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMealStore, type Profile } from "@/hooks/use-meal-selections";
import {
  CalendarDays,
  ShoppingCart,
  Store,
  UtensilsCrossed,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Mi Dieta", icon: CalendarDays },
  { href: "/mercadona", label: "Mercadona", icon: Store },
  { href: "/shopping-list", label: "Lista Compra", icon: ShoppingCart },
];

const PROFILES: { id: Profile; label: string; color: string }[] = [
  { id: "dani", label: "Dani", color: "bg-orange-500" },
  { id: "nil", label: "Nil", color: "bg-blue-500" },
];

export function Navbar() {
  const pathname = usePathname();
  const { activeProfile, setProfile } = useMealStore();

  return (
    <>
      {/* Desktop navbar */}
      <nav className="hidden md:flex items-center justify-between border-b bg-white px-6 h-14 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-orange-500" />
            <span className="font-bold text-lg">Mi Dieta</span>
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

        {/* Profile selector */}
        <div className="flex items-center gap-0.5 bg-[#F0F0F0] rounded-xl p-[3px]">
          {PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setProfile(profile.id)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] text-[13px] font-medium transition-all",
                activeProfile === profile.id
                  ? "bg-white shadow-sm text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "w-[22px] h-[22px] rounded-full flex items-center justify-center text-white text-[10px] font-bold",
                  profile.color
                )}
              >
                {profile.label[0]}
              </div>
              {profile.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile top bar + bottom nav */}
      <div className="md:hidden">
        <div className="flex items-center justify-between border-b bg-white px-4 h-12 shrink-0">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-orange-500" />
            <span className="font-bold">Mi Dieta</span>
          </div>

          <div className="flex items-center gap-0.5 bg-[#F0F0F0] rounded-lg p-0.5">
            {PROFILES.map((profile) => (
              <button
                key={profile.id}
                onClick={() => setProfile(profile.id)}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                  activeProfile === profile.id
                    ? "bg-white shadow-sm text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold",
                    profile.color
                  )}
                >
                  {profile.label[0]}
                </div>
                {profile.label}
              </button>
            ))}
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
                  isActive
                    ? "text-orange-600"
                    : "text-muted-foreground"
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
