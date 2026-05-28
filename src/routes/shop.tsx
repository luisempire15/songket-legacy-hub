import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { categories, type Category } from "@/lib/mockData";
import { useApp } from "@/context/AppContext";
import { ProductCard } from "@/components/site/ProductCard";
import { cn } from "@/lib/utils";

type SortKey = "newest" | "popular" | "price_asc" | "price_desc";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Koleksi Songket — Dekranasda Sumsel" },
      { name: "description", content: "Jelajahi koleksi Songket Palembang, Jumputan, Tajung, dan Blongsong dari pengrajin UMKM Sumsel." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    category: (s.category as string) || "",
    q: (s.q as string) || "",
  }),
  component: Shop,
});

function Shop() {
  const { category: initialCat, q: initialQ } = Route.useSearch();
  const { products } = useApp();
  const [cat, setCat] = useState<Category | "">(((initialCat as Category) || ""));
  const [q, setQ] = useState(initialQ);
  const [sort, setSort] = useState<SortKey>("popular");

  const list = useMemo(() => {
    let r = products.slice();
    if (cat) r = r.filter((p) => p.category === cat);
    if (q.trim()) {
      const s = q.toLowerCase();
      r = r.filter((p) => p.name.toLowerCase().includes(s) || p.umkm_name.toLowerCase().includes(s));
    }
    if (sort === "price_asc") r.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") r.sort((a, b) => b.price - a.price);
    if (sort === "popular") r.sort((a, b) => b.total_sold - a.total_sold);
    if (sort === "newest") r.reverse();
    return r;
  }, [cat, q, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Koleksi</p>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Mahakarya UMKM Sumsel</h1>
        <p className="text-sm text-muted-foreground">Tampil {list.length} dari {products.length} produk</p>
      </div>

      {/* search + sort */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari produk atau UMKM..."
            className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="h-12 rounded-full border border-border bg-card px-5 text-sm font-medium outline-none focus:border-gold"
        >
          <option value="popular">Terpopuler</option>
          <option value="newest">Terbaru</option>
          <option value="price_asc">Harga Terendah</option>
          <option value="price_desc">Harga Tertinggi</option>
        </select>
      </div>

      {/* category pills */}
      <div className="mb-10 flex flex-wrap gap-2">
        <Pill active={cat === ""} onClick={() => setCat("")}>Semua</Pill>
        {categories.map((c) => (
          <Pill key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Pill>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <p className="font-display text-xl font-semibold text-foreground">Tidak ada produk ditemukan</p>
          <p className="mt-2 text-sm text-muted-foreground">Coba kata kunci atau kategori lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition-all",
        active
          ? "bg-primary text-primary-foreground shadow-elegant"
          : "border border-border bg-card text-foreground/70 hover:border-gold hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}
