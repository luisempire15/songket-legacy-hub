import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Store, Minus, Plus, ShoppingBag, Truck, ShieldCheck, ArrowLeft, Award } from "lucide-react";
import { toast } from "sonner";
import { products, formatIDR } from "@/lib/mockData";
import { useApp } from "@/context/AppContext";
import { ProductCard } from "@/components/site/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/shop/product/$id")({
  loader: ({ params }) => {
    let localProducts = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("dekranasda_products");
        if (raw) localProducts = JSON.parse(raw);
      } catch (e) {
        console.error("Failed to load products from localStorage in loader", e);
      }
    }
    const p = localProducts.find((x: any) => x.id === params.id) || products.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Dekranasda Sumsel` },
          { name: "description", content: loaderData.product.description.slice(0, 160) },
          { property: "og:image", content: loaderData.product.image_url },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-32 text-center">
      <h1 className="font-display text-3xl">Produk tidak ditemukan</h1>
      <Link to="/shop" className="mt-6 inline-block text-primary underline">Kembali ke Koleksi</Link>
    </div>
  ),
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { product: loaderProduct } = Route.useLoaderData();
  const { addToCart, products: ctxProducts } = useApp();
  // Prefer up-to-date product from context (certified flag may change)
  const product = ctxProducts.find((p) => p.id === id) ?? loaderProduct;
  const [qty, setQty] = useState(1);
  const related = ctxProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    addToCart(product, qty);
    toast.success(`${qty}× ${product.name} ditambahkan ke keranjang`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      <Link to="/shop" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Koleksi
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
          <img
            src={product.image_url}
            alt={product.name}
            width={768}
            height={1024}
            className="aspect-[3/4] w-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <span className="self-start rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {product.category}
          </span>
          {product.certified && (
            <div className="mt-3 inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r from-gold to-[oklch(0.65_0.15_70)] px-4 py-1.5 text-xs font-bold text-gold-foreground shadow-gold">
              <Award className="h-4 w-4" />
              Sertifikat Resmi Dekranasda Sumsel
            </div>
          )}
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 font-medium">
              <Star className="h-4 w-4 fill-gold text-gold" />
              {product.rating.toFixed(1)} <span className="text-muted-foreground">({product.total_reviews} ulasan)</span>
            </span>
            <span className="text-muted-foreground">{product.total_sold} terjual</span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <Store className="h-4 w-4 text-gold" />
            <span className="text-muted-foreground">UMKM</span>
            <span className="font-medium text-foreground">{product.umkm_name}</span>
          </div>

          <div className="mt-6 rounded-2xl bg-cream p-5">
            {product.original_price && (
              <div className="text-sm text-muted-foreground line-through">{formatIDR(product.original_price)}</div>
            )}
            <div className="font-display text-4xl font-bold text-primary">{formatIDR(product.price)}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Stok tersedia: <span className="font-medium text-foreground">{product.stock}</span>
            </div>
          </div>

          <Tabs defaultValue="description" className="mt-6 w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Deskripsi</TabsTrigger>
              <TabsTrigger value="specification">Spesifikasi</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 text-sm leading-relaxed text-foreground/80 bg-card border border-border rounded-xl p-5">
              {product.description}
            </TabsContent>
            <TabsContent value="specification" className="mt-4 bg-card border border-border rounded-xl p-5">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Bahan</dt>
                  <dd className="mt-1 font-medium text-foreground">{product.material}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">Berat</dt>
                  <dd className="mt-1 font-medium text-foreground">{product.weight} g</dd>
                </div>
              </dl>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-primary">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-primary">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 font-medium text-primary-foreground shadow-elegant transition-colors hover:bg-primary-glow"
            >
              <ShoppingBag className="h-4 w-4" /> Tambah ke Keranjang
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2.5">
              <Truck className="h-4 w-4 text-primary" /> Pengiriman ke seluruh Indonesia
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> Bersertifikat Dekranasda
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-bold">Produk Serupa</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
