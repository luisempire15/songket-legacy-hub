import { createFileRoute } from "@tanstack/react-router";
import { Check, X, MapPin, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { formatDateID, type UmkmStatus } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/admin/umkm")({
  component: AdminUmkm,
});

function AdminUmkm() {
  const { umkmApps, reviewUmkm } = useApp();
  const [filter, setFilter] = useState<UmkmStatus | "All">("Pending");
  const list = umkmApps.filter((u) => filter === "All" || u.status === filter);

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">UMKM</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Kelola Pendaftaran UMKM</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tinjau dan setujui aplikasi pengrajin baru.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["Pending", "Approved", "Rejected", "All"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              filter === f ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:border-gold",
            )}
          >
            {f === "All" ? "Semua" : f} ({umkmApps.filter((u) => f === "All" || u.status === f).length})
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card py-16 text-center text-sm text-muted-foreground">
            Tidak ada UMKM dengan status ini.
          </div>
        )}
        {list.map((u) => (
          <div key={u.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold">{u.umkm_name}</h3>
                  <StatusBadge status={u.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Diajukan {formatDateID(u.created_at)} oleh <span className="font-medium text-foreground">{u.owner_name}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/85">{u.description}</p>
                <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-gold" /> {u.city}</span>
                  <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-gold" /> {u.email}</span>
                  <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-gold" /> {u.phone}</span>
                </div>
              </div>
              {u.status === "Pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => { reviewUmkm(u.id, "Approved"); toast.success(`${u.umkm_name} disetujui`); }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-glow"
                  >
                    <Check className="h-3.5 w-3.5" /> Setujui
                  </button>
                  <button
                    onClick={() => { reviewUmkm(u.id, "Rejected"); toast.error(`${u.umkm_name} ditolak`); }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-destructive px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-3.5 w-3.5" /> Tolak
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: UmkmStatus }) {
  const map = {
    Pending: "bg-gold/20 text-primary",
    Approved: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-destructive/15 text-destructive",
  };
  return <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", map[status])}>{status}</span>;
}
