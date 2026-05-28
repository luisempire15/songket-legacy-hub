import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Store, Receipt, ShieldCheck, Users, LogOut } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const items = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/umkm", label: "Kelola UMKM", icon: Store },
  { to: "/admin/transactions", label: "Transaksi", icon: Receipt },
  { to: "/admin/certificates", label: "Verifikasi Sertifikat", icon: ShieldCheck },
  { to: "/admin/buyers", label: "Pembeli", icon: Users },
];

export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout, umkmApps, certificates } = useApp();
  const pendingUmkm = umkmApps.filter((u) => u.status === "Pending").length;
  const pendingCert = certificates.filter((c) => c.status === "Pending").length;

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="border-b border-border p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">Admin Panel</p>
        <p className="mt-1 font-display text-base font-bold">Dekranasda Sumsel</p>
        <p className="mt-3 text-xs text-muted-foreground">{user?.full_name}</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((it) => {
          const active = it.exact ? pathname === it.to : pathname === it.to || pathname.startsWith(it.to + "/");
          const Icon = it.icon;
          const badge = it.to === "/admin/umkm" ? pendingUmkm : it.to === "/admin/certificates" ? pendingCert : 0;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground shadow-elegant" : "text-foreground/75 hover:bg-secondary hover:text-primary",
              )}
            >
              <span className="flex items-center gap-3"><Icon className="h-4 w-4" /> {it.label}</span>
              {badge > 0 && (
                <span className={cn("rounded-full px-1.5 text-[10px] font-bold", active ? "bg-gold text-gold-foreground" : "bg-gold text-gold-foreground")}>
                  {badge}
                </span>
              )}
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

export function AdminMobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
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
