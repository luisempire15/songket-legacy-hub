import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { formatIDR } from "@/lib/mockData";

export const Route = createFileRoute("/admin/buyers")({
  component: AdminBuyers,
});

function AdminBuyers() {
  const { orders } = useApp();
  // Aggregate buyers from order history (mock platform analytics)
  const map = new Map<string, { id: string; name: string; orders: number; spent: number; last: string }>();
  for (const o of orders) {
    const prev = map.get(o.buyer_id);
    if (prev) {
      prev.orders += 1;
      prev.spent += o.total;
      if (o.created_at > prev.last) prev.last = o.created_at;
    } else {
      map.set(o.buyer_id, { id: o.buyer_id, name: o.buyer_name, orders: 1, spent: o.total, last: o.created_at });
    }
  }
  const buyers = [...map.values()].sort((a, b) => b.spent - a.spent);

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Pembeli</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Daftar Pembeli</h1>
        <p className="mt-1 text-sm text-muted-foreground">{buyers.length} pembeli aktif di platform.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Pembeli</th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-right">Total Pesanan</th>
                <th className="px-4 py-3 text-right">Total Belanja</th>
                <th className="px-4 py-3 text-left">Pesanan Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {buyers.map((b) => (
                <tr key={b.id} className="hover:bg-secondary/50">
                  <td className="px-4 py-3 font-medium">{b.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{b.id}</td>
                  <td className="px-4 py-3 text-right">{b.orders}</td>
                  <td className="px-4 py-3 text-right font-display font-bold text-primary">{formatIDR(b.spent)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(b.last).toLocaleDateString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
