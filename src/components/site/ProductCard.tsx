import { Link } from "react-router-dom";
import { Star, Store } from "lucide-react";
import { formatIDR, type Product } from "@/lib/mockData";

export function ProductCard({ product }: { product: Product }) {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;
  return (
    <Link
      to={`/shop/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-gold hover:shadow-elegant"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-gold/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-foreground shadow-gold">
          {product.category}
        </span>
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
            -{discount}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-base font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Store className="h-3 w-3" />
          <span className="truncate">{product.umkm_name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-0.5 font-medium text-foreground">
            <Star className="h-3 w-3 fill-gold text-gold" />
            {product.rating.toFixed(1)}
          </span>
          <span className="text-muted-foreground">· {product.total_sold} terjual</span>
        </div>
        <div className="mt-auto pt-2">
          {product.original_price && (
            <span className="text-xs text-muted-foreground line-through">{formatIDR(product.original_price)}</span>
          )}
          <div className="font-display text-lg font-bold text-primary">{formatIDR(product.price)}</div>
        </div>
      </div>
    </Link>
  );
}
