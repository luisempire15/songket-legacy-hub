import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Package, Truck, X } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { formatDateID, formatIDR, type OrderStatus, type Order } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { OrderStatusBadge } from "./admin.transactions";

export const Route = createFileRoute("/seller/orders")({
  component: SellerOrders,
});

function SellerOrders() {
  const { user, orders, updateOrderStatus } = useApp();
  const [filter, setFilter] = useState<OrderStatus | "All">("All");
  const [tracking, setTracking] = useState<{ order: Order; value: string } | null>(null);

  const myOrders = orders
    .map((o) => ({ ...o, items: o.items.filter((i) => i.seller_id === user?.id) }))
    .filter((o) => o.items.length > 0)
    .filter((o) => filter === "All" || o.status === filter);

  const changeStatus = (o: Order, next: OrderStatus) => {
    if (next === "Shipped" && !o.tracking_number) {
      setTracking({ order: o, value: "" });
      return;
    }
    updateOrderStatus(o.id, next);
    toast.success(`Status pesanan ${o.id} → ${next}`);
  };

  const confirmShip = () => {
    if (!tracking) return;
    if (!tracking.value.trim()) return toast.error("Nomor resi wajib diisi");
    updateOrderStatus(tracking.order.id, "Shipped", tracking.value.trim());
    toast.success(`Pesanan dikirim dengan resi ${tracking.value}`);
    setTracking(null);
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Pesanan</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Kelola Pesanan</h1>
        <p className="mt-1 text-sm text-muted-foreground">Proses pesanan masuk dan kirim dengan nomor resi.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-medium",
            filter === s ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:border-gold",
          )}>
            {s === "All" ? "Semua" : s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {myOrders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card py-20 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">Tidak ada pesanan dengan status ini.</p>
          </div>
        )}
        {myOrders.map((o) => {
          const subtotal = o.items.reduce((s, i) => s + i.qty * i.price, 0);
          return (
            <div key={o.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-sm font-bold">{o.id}</h3>
                    <OrderStatusBadge status={o.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{o.buyer_name} · {formatDateID(o.created_at)} · {o.payment_method}</p>
                  <p className="mt-1 text-xs text-muted-foreground">📍 {o.shipping_address}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold text-primary">{formatIDR(subtotal)}</p>
                  {o.tracking_number && <p className="text-xs text-muted-foreground">Resi: <span className="font-mono font-semibold text-foreground">{o.tracking_number}</span></p>}
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                {o.items.map((i) => (
                  <li key={i.product_id} className="flex items-center gap-3 rounded-lg bg-secondary/40 p-2 text-sm">
                    <img src={i.image_url} alt={i.product_name} className="h-12 w-12 rounded-md object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{i.product_name}</p>
                      <p className="text-xs text-muted-foreground">{i.qty} × {formatIDR(i.price)}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                {o.status === "Pending" && (
                  <button onClick={() => changeStatus(o, "Processing")} className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-glow">
                    Terima & Proses
                  </button>
                )}
                {o.status === "Processing" && (
                  <button onClick={() => changeStatus(o, "Shipped")} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-glow">
                    <Truck className="h-3.5 w-3.5" /> Kirim Pesanan
                  </button>
                )}
                {o.status === "Shipped" && (
                  <button onClick={() => changeStatus(o, "Delivered")} className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-glow">
                    Tandai Diterima
                  </button>
                )}
                {(o.status === "Pending" || o.status === "Processing") && (
                  <button onClick={() => changeStatus(o, "Cancelled")} className="rounded-full border border-destructive px-4 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10">
                    Batalkan
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {tracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur">
          <div className="w-full max-w-md rounded-3xl bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Input Nomor Resi</h3>
              <button onClick={() => setTracking(null)} className="rounded-full p-1.5 hover:bg-secondary"><X className="h-5 w-5" /></button>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">Pesanan <span className="font-mono font-semibold text-foreground">{tracking.order.id}</span> akan dikirim ke {tracking.order.shipping_address}.</p>
            <input
              autoFocus value={tracking.value}
              onChange={(e) => setTracking({ ...tracking, value: e.target.value })}
              placeholder="cth: JNE-1234567890"
              className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
            <div className="mt-4 flex gap-2">
              <button onClick={() => setTracking(null)} className="h-12 flex-1 rounded-full border border-border text-sm font-medium hover:bg-secondary">Batal</button>
              <button onClick={confirmShip} className="h-12 flex-[2] rounded-full bg-primary text-sm font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow">
                Konfirmasi Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
