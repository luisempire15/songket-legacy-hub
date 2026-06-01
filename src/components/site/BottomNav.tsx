import { Link, useLocation } from "react-router-dom";
import { Home, Store, ShoppingBag, User } from "lucide-react";
import { useCartController } from "@/hooks/useCartController";
import { useAuthController } from "@/hooks/useAuthController";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Beranda", icon: Home },
  { to: "/shop", label: "Koleksi", icon: Store },
  { to: "/cart", label: "Keranjang", icon: ShoppingBag, badge: true },
  { to: "/login", label: "Akun", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const { cartCount } = useCartController();
  const { user } = useAuthController();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-md sm:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {items.map((it) => {
          const active = it.to === "/" ? pathname === "/" : pathname.startsWith(it.to);
          const Icon = it.icon;
          const to = it.to === "/login" && user ? "/" : it.to;
          return (
            <li key={it.label}>
              <Link
                to={to}
                className={cn(
                  "relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {it.badge && cartCount > 0 && (
                  <span className="absolute right-[calc(50%-18px)] top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-gold-foreground">
                    {cartCount}
                  </span>
                )}
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
