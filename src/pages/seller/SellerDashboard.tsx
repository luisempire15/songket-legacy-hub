import { Link } from "react-router-dom";
import { Package, ClipboardList, Award, TrendingUp, ShoppingBag } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatIDR, formatDateID } from "@/lib/mockData";
import { OrderStatusBadge } from "@/pages/admin/AdminTransactions";

export default function SellerDashboard() {
  const { user, products, orders, certificates } = useApp();
  const myProducts = products.filter((p) => p.seller_id === user?.id);
  const myOrders = orders.filter((o) => o.items.some((i) => i.seller_id === user?.id));
  const myRevenue = myOrders.reduce((sum, o) => sum + o.items.filter((i) => i.seller_id === user?.id).reduce((s, i) => s + i.qty * i.price, 0), 0);
  const myCerts = certificates.filter((c) => c.seller_id === user?.id);
  const approvedCerts = myCerts.filter((c) => c.status === "Approved").length;

  const stats = [
    { label: "Produk Aktif", value: myProducts.length, icon: Package },
    { label: "Total Pesanan", value: myOrders.length, icon: ShoppingBag },
    { label: "Pendapatan", value: formatIDR(myRevenue), icon: TrendingUp },
    { label: "Produk Bersertifikat", value: `${approvedCerts} / ${myProducts.length}`, icon: Award },
  ];

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Seller Center</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Halo, {user?.full_name.split(" ")[0]} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">{user?.umkm_name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
            <Link to="/seller/orders" className="text-xs font-medium text-primary hover:underline">Kelola →</Link>
          </div>
          <ul className="divide-y divide-border">
            {myOrders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">{o.id}</p>
                  <p className="truncate text-xs text-muted-foreground">{o.buyer_name} · {formatDateID(o.created_at)}</p>
                </div>
                <OrderStatusBadge status={o.status} />
              </li>
            ))}
            {myOrders.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">Belum ada pesanan.</li>}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Status Sertifikasi</h2>
            <Link to="/seller/certificates" className="text-xs font-medium text-primary hover:underline">Ajukan →</Link>
          </div>
          <ul className="divide-y divide-border">
            {myCerts.slice(0, 5).map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{c.product_name}</p>
                  <p className="text-xs text-muted-foreground">{formatDateID(c.created_at)}</p>
                </div>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold">{c.status}</span>
              </li>
            ))}
            {myCerts.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">Belum ada pengajuan sertifikat.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
