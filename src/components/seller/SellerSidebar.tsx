import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ClipboardList, Award, LogOut } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const items = [
  { to: "/seller", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/seller/products", label: "Produk Saya", icon: Package },
  { to: "/seller/orders", label: "Pesanan", icon: ClipboardList },
  { to: "/seller/certificates", label: "Sertifikasi", icon: Award },
];

export function SellerSidebar() {
  const { pathname } = useLocation();
  const { user, logout, orders, certificates } = useApp();
  const pendingOrders = orders.filter((o) => o.items.some((i) => i.seller_id === user?.id) && o.status === "Pending").length;
  const pendingCert = certificates.filter((c) => c.seller_id === user?.id && c.status === "Pending").length;

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="border-b border-border p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">Seller Center</p>
        <p className="mt-1 font-display text-base font-bold">{user?.umkm_name ?? user?.full_name}</p>
        <p className="mt-3 text-xs text-muted-foreground">{user?.email}</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((it) => {
          const active = it.exact ? pathname === it.to : pathname === it.to || pathname.startsWith(it.to + "/");
          const Icon = it.icon;
          const badge = it.to === "/seller/orders" ? pendingOrders : it.to === "/seller/certificates" ? pendingCert : 0;
          return (
            <Link key={it.to} to={it.to} className={cn(
              "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-primary text-primary-foreground shadow-elegant" : "text-foreground/75 hover:bg-secondary hover:text-primary",
            )}>
              <span className="flex items-center gap-3"><Icon className="h-4 w-4" /> {it.label}</span>
              {badge > 0 && <span className="rounded-full bg-gold px-1.5 text-[10px] font-bold text-gold-foreground">{badge}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/75 hover:bg-secondary hover:text-destructive">
          <LogOut className="h-4 w-4" /> Keluar
        </button>
      </div>
    </aside>
  );
}

export function SellerMobileNav() {
  const { pathname } = useLocation();
  return (
    <div className="sticky top-16 z-20 flex gap-1 overflow-x-auto border-b border-border bg-background/95 px-3 py-2 backdrop-blur lg:hidden">
      {items.map((it) => {
        const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
        const Icon = it.icon;
        return (
          <Link key={it.to} to={it.to} className={cn("flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium", active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70")}>
            <Icon className="h-3.5 w-3.5" /> {it.label}
          </Link>
        );
      })}
    </div>
  );
}
