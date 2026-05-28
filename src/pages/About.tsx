import { Award, ShieldCheck, HeartHandshake, Users } from "lucide-react";

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Tentang Kami</p>
      <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
        Menjaga Warisan, <span className="text-gradient-gold italic">Memberdayakan Pengrajin</span>
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-foreground/80">
        Dewan Kerajinan Nasional Daerah (Dekranasda) Sumatera Selatan hadir sebagai jembatan antara warisan tenun
        Songket yang telah hidup ratusan tahun dengan pasar modern. Marketplace ini adalah platform resmi yang
        menghubungkan Anda langsung dengan pengrajin UMKM bersertifikat di seluruh Sumsel.
      </p>

      <div className="my-12 gold-divider" />

      <div className="grid gap-6 sm:grid-cols-2">
        {[
          { Icon: ShieldCheck, t: "Verifikasi Resmi", d: "Setiap UMKM mitra melewati proses verifikasi langsung oleh Dekranasda Sumsel." },
          { Icon: Award, t: "Sertifikasi Produk", d: "Produk yang dijual telah melalui standar kualitas dan keaslian tenun tradisional." },
          { Icon: HeartHandshake, t: "Harga Adil", d: "Tanpa perantara — pengrajin menerima nilai yang layak untuk setiap karya." },
          { Icon: Users, t: "120+ UMKM Mitra", d: "Jaringan pengrajin Songket, Jumputan, Tajung, dan Blongsong terbesar di Sumsel." },
        ].map(({ Icon, t, d }) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{t}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
