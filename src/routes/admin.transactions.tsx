import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatDateID, formatIDR, type OrderStatus } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/transactions")({
  component: AdminTransactions,
});

const STATUSES: (OrderStatus | "All")[] = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

function AdminTransactions() {
  const { orders } = useApp();
  const [filter, setFilter] = useState<OrderStatus | "All">("All");
  const list = orders.filter((o) => filter === "All" || o.status === filter);

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Transaksi</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Log Pesanan Platform</h1>
        <p className="mt-1 text-sm text-muted-foreground">Semua transaksi dari seluruh UMKM di platform.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-medium",
            filter === s ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:border-gold",
          )}>
            {s === "All" ? "Semua" : s}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Pembeli</th>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Pembayaran</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Tgl</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((o) => (
                <tr key={o.id} className="hover:bg-secondary/50">
                  <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                  <td className="px-4 py-3">{o.buyer_name}</td>
                  <td className="px-4 py-3 max-w-[260px]">
                    <div className="truncate text-xs text-muted-foreground">
                      {o.items.map((i) => `${i.qty}× ${i.product_name}`).join(", ")}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-display font-bold text-primary">{formatIDR(o.total)}</td>
                  <td className="px-4 py-3 text-xs">{o.payment_method}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDateID(o.created_at)}</td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={7} className="py-16 text-center text-muted-foreground">Tidak ada transaksi.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, string> = {
    Pending: "bg-gold/20 text-primary",
    Processing: "bg-blue-100 text-blue-700",
    Shipped: "bg-indigo-100 text-indigo-700",
    Delivered: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-destructive/15 text-destructive",
  };
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", map[status])}>{status}</span>;
}
