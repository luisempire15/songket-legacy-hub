import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, ZoomIn } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { formatDateID, type CertStatus } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/certificates")({
  component: AdminCertificates,
});

function AdminCertificates() {
  const { certificates, reviewCertificate } = useApp();
  const [filter, setFilter] = useState<CertStatus | "All">("Pending");
  const [preview, setPreview] = useState<string | null>(null);
  const list = certificates.filter((c) => filter === "All" || c.status === filter);

  const handleReject = (id: string, name: string) => {
    const reason = window.prompt(`Alasan menolak sertifikat untuk "${name}":`, "Foto bukti kurang jelas");
    if (reason === null) return;
    reviewCertificate(id, "Rejected", reason);
    toast.error("Pengajuan sertifikat ditolak");
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Sertifikasi</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Verifikasi Sertifikat Keaslian</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tinjau foto bukti tenunan dari penjual sebelum produk mendapatkan badge resmi.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["Pending", "Approved", "Rejected", "All"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium",
            filter === f ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:border-gold",
          )}>
            {f === "All" ? "Semua" : f} ({certificates.filter((c) => f === "All" || c.status === f).length})
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {list.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-card py-16 text-center text-sm text-muted-foreground">
            Tidak ada pengajuan untuk status ini.
          </div>
        )}
        {list.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border border-border bg-card">
            <button onClick={() => setPreview(c.proof_image)} className="group relative block aspect-video w-full overflow-hidden bg-muted">
              <img src={c.proof_image} alt={c.product_name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-opacity group-hover:bg-foreground/30 group-hover:opacity-100">
                <ZoomIn className="h-8 w-8 text-white" />
              </div>
            </button>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-base font-bold">{c.product_name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.umkm_name} · {formatDateID(c.created_at)}</p>
                </div>
                <CertBadge status={c.status} />
              </div>
              <p className="mt-3 text-sm text-foreground/80">{c.notes}</p>
              {c.rejection_reason && (
                <p className="mt-2 rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
                  <strong>Alasan ditolak:</strong> {c.rejection_reason}
                </p>
              )}
              {c.status === "Pending" && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => { reviewCertificate(c.id, "Approved"); toast.success("Sertifikat disetujui — produk kini bersertifikat resmi"); }}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-glow"
                  >
                    <Check className="h-3.5 w-3.5" /> Setujui
                  </button>
                  <button
                    onClick={() => handleReject(c.id, c.product_name)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-destructive px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-3.5 w-3.5" /> Tolak
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <div onClick={() => setPreview(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4 backdrop-blur">
          <img src={preview} alt="Preview" className="max-h-[90vh] max-w-full rounded-2xl shadow-elegant" />
        </div>
      )}
    </div>
  );
}

function CertBadge({ status }: { status: CertStatus }) {
  const map = {
    Pending: "bg-gold/20 text-primary",
    Approved: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-destructive/15 text-destructive",
  };
  return <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", map[status])}>{status}</span>;
}
