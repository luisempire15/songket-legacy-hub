import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { useCartController } from "@/hooks/useCartController";
import { useAuthController } from "@/hooks/useAuthController";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Beranda" },
  { to: "/shop", label: "Koleksi" },
  { to: "/about", label: "Tentang" },
];

export function Header() {
  const { cartCount } = useCartController();
  const { user, logout } = useAuthController();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const isSeller = user?.role === "seller";
  const isBuyer = user?.role === "buyer";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        <Link to={isAdmin ? "/admin" : isSeller ? "/seller" : "/"} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-elegant">
            <span className="font-display text-lg font-bold">D</span>
          </div>
          <div>
            <div className="font-display text-base font-bold leading-tight text-primary">
              {isAdmin ? "Admin Dekranasda" : isSeller ? "Seller Center" : "Dekranasda"}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {isAdmin ? "Sumatera Selatan" : isSeller ? user?.umkm_name : "Sumatera Selatan"}
            </div>
          </div>
        </Link>

        {/* Hide main navigation for admin/seller */}
        {!isAdmin && !isSeller && (
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => {
              const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to.split("?")[0]);
              return (
                <Link
                  key={n.label}
                  to={n.to}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active ? "text-primary" : "text-foreground/70 hover:text-primary",
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-1.5">
          {/* Hide search and cart for admin/seller */}
          {!isAdmin && !isSeller && (
            <>
              <Link
                to="/shop"
                className="hidden h-9 w-9 items-center justify-center rounded-md text-foreground/70 hover:bg-secondary hover:text-primary sm:flex"
                aria-label="Cari"
              >
                <Search className="h-4 w-4" />
              </Link>
              <Link
                to="/cart"
                className="relative flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 hover:bg-secondary hover:text-primary"
                aria-label="Keranjang"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-gold-foreground">
                    {cartCount}
                  </span>
                )}
              </Link>
              {isBuyer && (
                <Link
                  to="/shop/orders"
                  className={cn(
                    "flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors",
                    pathname === "/shop/orders"
                      ? "bg-secondary text-primary font-semibold border border-primary/20"
                      : "text-foreground/70 hover:bg-secondary hover:text-primary"
                  )}
                >
                  Pesanan Saya
                </Link>
              )}
            </>
          )}

          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              {isAdmin && (
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-primary">Admin Platform</span>
              )}
              {isSeller && (
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-primary">Mitra UMKM</span>
              )}
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {user.full_name.split(" ")[0]}
              </span>
              <button
                onClick={() => {
                  if (window.confirm("Apakah Anda yakin ingin keluar dari akun ini?")) {
                    logout();
                    toast.success("Berhasil keluar dari akun.");
                  }
                }}
                className="text-xs font-medium text-muted-foreground hover:text-primary cursor-pointer transition-colors"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-glow sm:inline-flex"
            >
              <User className="h-4 w-4" /> Masuk
            </Link>
          )}

          {/* Hide mobile hamburger toggle if not general pages */}
          {!isAdmin && !isSeller && (
            <button
              className="flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 hover:bg-secondary lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {open && !isAdmin && !isSeller && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-primary"
              >
                {n.label}
              </Link>
            ))}
            {isBuyer && (
              <Link
                to="/shop/orders"
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === "/shop/orders"
                    ? "bg-secondary text-primary font-semibold"
                    : "text-foreground/80 hover:bg-secondary hover:text-primary"
                )}
              >
                Pesanan Saya
              </Link>
            )}
            {!user && (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-md bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground"
              >
                Masuk / Daftar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
