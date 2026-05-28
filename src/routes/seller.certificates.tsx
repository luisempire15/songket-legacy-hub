import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Award, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { formatDateID, type CertStatus } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/seller/certificates")({
  component: SellerCertificates,
});

function SellerCertificates() {
  const { user, products, certificates, requestCertificate } = useApp();
  const myProducts = products.filter((p) => p.seller_id === user?.id);
  const myCerts = certificates.filter((c) => c.seller_id === user?.id);
  const [show, setShow] = useState(false);
  const [productId, setProductId] = useState(myProducts[0]?.id ?? "");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<string>("");

  const onImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = myProducts.find((x) => x.id === productId);
    if (!p) return toast.error("Pilih produk dulu");
    if (!image) return toast.error("Upload foto bukti tenunan");
    if (!notes.trim()) return toast.error("Tulis catatan singkat");
    requestCertificate({
      product_id: p.id,
      product_name: p.name,
      seller_id: user!.id,
      umkm_name: user!.umkm_name ?? user!.full_name,
      proof_image: image,
      notes: notes.trim(),
    });
    toast.success("Pengajuan sertifikat dikirim — menunggu verifikasi Admin");
    setShow(false);
    setImage(""); setNotes(""); setProductId(myProducts[0]?.id ?? "");
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Sertifikasi</p>
          <h1 className="mt-1 font-display text-3xl font-bold">Sertifikat Keaslian</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ajukan sertifikasi resmi Dekranasda untuk produk Anda.</p>
        </div>
        <button onClick={() => setShow(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow">
          <Award className="h-4 w-4" /> Ajukan Sertifikat Baru
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {myCerts.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-card py-20 text-center">
            <Award className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">Belum ada pengajuan sertifikat. Mulai ajukan untuk meningkatkan kepercayaan pembeli.</p>
          </div>
        )}
        {myCerts.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border border-border bg-card">
            <img src={c.proof_image} alt={c.product_name} className="aspect-video w-full object-cover" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-base font-bold">{c.product_name}</h3>
                <CertBadge status={c.status} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Diajukan {formatDateID(c.created_at)}</p>
              <p className="mt-3 text-sm text-foreground/85">{c.notes}</p>
              {c.rejection_reason && (
                <p className="mt-2 rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
                  <strong>Ditolak:</strong> {c.rejection_reason}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {show && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/60 p-0 backdrop-blur sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card p-6 sm:rounded-3xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Ajukan Sertifikat Keaslian</h2>
              <button onClick={() => setShow(false)} className="rounded-full p-1.5 hover:bg-secondary"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pilih Produk</label>
                <select value={productId} onChange={(e) => setProductId(e.target.value)} required
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-gold">
                  <option value="">— Pilih produk —</option>
                  {myProducts.map((p) => <option key={p.id} value={p.id} disabled={p.certified}>{p.name}{p.certified ? " (sudah bersertifikat)" : ""}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Catatan untuk Verifikator</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} required
                  placeholder="Ceritakan proses pembuatan, pengrajin, dan keunikan tenunan Anda…"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Foto Bukti Tenunan (Detail)</label>
                {image ? (
                  <div className="relative">
                    <img src={image} alt="" className="aspect-video w-full rounded-xl object-cover" />
                    <button type="button" onClick={() => setImage("")} className="absolute right-2 top-2 rounded-full bg-foreground/70 p-1.5 text-white hover:bg-foreground"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background text-muted-foreground hover:border-gold hover:text-primary">
                    <Upload className="h-6 w-6" />
                    <span className="text-sm font-medium">Klik untuk upload foto detail</span>
                    <span className="text-xs">JPG / PNG, max 5 MB</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onImage(e.target.files[0])} />
                  </label>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShow(false)} className="h-12 flex-1 rounded-full border border-border font-medium hover:bg-secondary">Batal</button>
                <button type="submit" className="h-12 flex-[2] rounded-full bg-primary font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow">
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
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
