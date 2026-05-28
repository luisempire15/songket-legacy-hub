import { createFileRoute, Link } from "@tanstack/react-router";
import { Store, Receipt, ShieldCheck, Users, TrendingUp, Package } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatIDR, formatDateID } from "@/lib/mockData";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { umkmApps, orders, certificates, products } = useApp();
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingUmkm = umkmApps.filter((u) => u.status === "Pending").length;
  const pendingCert = certificates.filter((c) => c.status === "Pending").length;
  const recentOrders = orders.slice(0, 5);

  const stats = [
    { label: "Total UMKM Aktif", value: umkmApps.filter((u) => u.status === "Approved").length + 4, icon: Store, accent: "primary" },
    { label: "UMKM Pending", value: pendingUmkm, icon: Users, accent: "gold" },
    { label: "Total Produk", value: products.length, icon: Package, accent: "primary" },
    { label: "Sertifikat Pending", value: pendingCert, icon: ShieldCheck, accent: "gold" },
    { label: "Total Pesanan", value: orders.length, icon: Receipt, accent: "primary" },
    { label: "Total Revenue (GMV)", value: formatIDR(totalRevenue), icon: TrendingUp, accent: "gold" },
  ];

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Dashboard</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Overview Platform</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ringkasan aktivitas marketplace Dekranasda Sumsel hari ini.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          const accent = s.accent === "gold" ? "bg-gold/15 text-gold-foreground" : "bg-primary/10 text-primary";
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-display text-2xl font-bold">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Pesanan Terbaru</h2>
            <Link to="/admin/transactions" className="text-xs font-medium text-primary hover:underline">Lihat semua →</Link>
          </div>
          <ul className="divide-y divide-border">
            {recentOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{o.buyer_name} · {formatDateID(o.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-primary">{formatIDR(o.total)}</p>
                  <p className="text-xs text-muted-foreground">{o.status}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Pendaftaran UMKM Baru</h2>
            <Link to="/admin/umkm" className="text-xs font-medium text-primary hover:underline">Tinjau →</Link>
          </div>
          <ul className="divide-y divide-border">
            {umkmApps.filter((u) => u.status === "Pending").slice(0, 5).map((u) => (
              <li key={u.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{u.umkm_name}</p>
                  <p className="text-xs text-muted-foreground">{u.owner_name} · {u.city}</p>
                </div>
                <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">Pending</span>
              </li>
            ))}
            {umkmApps.filter((u) => u.status === "Pending").length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">Tidak ada pendaftaran baru.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
