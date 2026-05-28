import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Award, Sparkles, Store } from "lucide-react";
import heroImg from "@/assets/hero-songket.jpg";
import { products } from "@/lib/mockData";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UMKM Songket Dekranasda Sumatera Selatan" },
      { name: "description", content: "Marketplace resmi tenun Songket asli Sumatera Selatan. Dukung pengrajin UMKM lokal." },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = products.slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Songket Palembang"
            width={1536}
            height={1024}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
          <div className="absolute inset-0 songket-pattern opacity-30 mix-blend-overlay" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-24 text-primary-foreground lg:py-36 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium uppercase tracking-widest text-gold">Dekranasda Sumsel</span>
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-7xl">
              Warisan Tenun <span className="text-gradient-gold italic">Songket</span> dari Tanah Sriwijaya
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              Setiap helai ditenun tangan oleh pengrajin UMKM Sumatera Selatan. Belanja langsung dari sumbernya — autentik, bersertifikat, mendukung budaya negeri.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-medium text-gold-foreground shadow-gold transition-transform hover:scale-105"
              >
                Jelajahi Koleksi
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/5 px-7 py-3.5 font-medium backdrop-blur hover:bg-primary-foreground/10"
              >
                <Store className="h-4 w-4" /> Daftarkan UMKM
              </Link>
            </div>
          </div>

          <div className="mt-4 grid max-w-2xl grid-cols-3 gap-6 border-t border-primary-foreground/15 pt-8">
            <Stat n="120+" l="UMKM Mitra" />
            <Stat n="2.500+" l="Produk Asli" />
            <Stat n="100%" l="Tersertifikasi" />
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:grid-cols-3 lg:px-8">
          <Feature
            Icon={ShieldCheck}
            title="100% Autentik"
            text="Setiap produk diverifikasi langsung oleh Dekranasda Sumsel."
          />
          <Feature
            Icon={Award}
            title="Pengrajin Bersertifikat"
            text="UMKM mitra terdaftar resmi dan dibina pemerintah provinsi."
          />
          <Feature
            Icon={Store}
            title="Dari Pengrajin"
            text="Belanja langsung tanpa perantara, harga adil untuk pengrajin."
          />
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Koleksi Pilihan</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Mahakarya Pekan Ini
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-glow sm:inline-flex"
          >
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CTA UMKM */}
      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground sm:p-16">
          <div className="absolute inset-0 songket-pattern opacity-25" />
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Untuk Pengrajin</p>
              <h3 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                Bawa Karya Anda ke <span className="text-gradient-gold italic">Pasar Nasional</span>
              </h3>
              <p className="mt-4 max-w-lg text-primary-foreground/80">
                Bergabunglah dengan ratusan UMKM Sumatera Selatan yang telah mempercayakan distribusi karya mereka melalui platform resmi Dekranasda.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 self-start rounded-full bg-gold px-7 py-3.5 font-medium text-gold-foreground shadow-gold transition-transform hover:scale-105 lg:self-end"
              >
                Daftar Gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-xs text-primary-foreground/60">Proses verifikasi 1–3 hari kerja</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-bold text-gold sm:text-4xl">{n}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-primary-foreground/70">{l}</div>
    </div>
  );
}

function Feature({ Icon, title, text }: { Icon: typeof ShieldCheck; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
