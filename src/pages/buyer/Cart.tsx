import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartController } from "@/hooks/useCartController";
import { useAuthController } from "@/hooks/useAuthController";
import { formatIDR } from "@/lib/mockData";
import { toast } from "sonner";

export default function Cart() {
  const { cart, updateQty, removeFromCart, cartTotal } = useCartController();
  const { user } = useAuthController();
  const navigate = useNavigate();
  const shipping = cart.length > 0 ? 25000 : 0;

  const handleCheckout = () => {
    if (!user) {
      toast.error("Silakan masuk dulu untuk checkout");
      return navigate("/login");
    }
    navigate("/shop/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-9 w-9 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Keranjang masih kosong</h1>
        <p className="mt-2 text-muted-foreground">Mulai jelajahi koleksi Songket pilihan kami.</p>
        <Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow">
          Lihat Koleksi <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-14">
      <h1 className="mb-8 font-display text-3xl font-bold sm:text-4xl">Keranjang Belanja</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <ul className="space-y-4">
          {cart.map(({ product, qty }) => (
            <li key={product.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
              <Link to={`/shop/product/${product.id}`} className="shrink-0">
                <img src={product.image_url} alt={product.name} loading="lazy" className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28" />
              </Link>
              <div className="flex flex-1 flex-col gap-1.5">
                <Link to={`/shop/product/${product.id}`} className="font-display text-base font-semibold leading-tight hover:text-primary line-clamp-2">
                  {product.name}
                </Link>
                <p className="text-xs text-muted-foreground">{product.umkm_name}</p>
                <p className="font-display text-lg font-bold text-primary">{formatIDR(product.price)}</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-full border border-border">
                    <button onClick={() => updateQty(product.id, qty - 1)} className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-primary cursor-pointer"><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center text-sm font-medium">{qty}</span>
                    <button onClick={() => updateQty(product.id, qty + 1)} className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-primary cursor-pointer"><Plus className="h-3 w-3" /></button>
                  </div>
                  <button onClick={() => removeFromCart(product.id)} className="flex items-center gap-1 text-xs font-medium text-destructive hover:underline cursor-pointer">
                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold">Ringkasan Pesanan</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-medium">{formatIDR(cartTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Estimasi Ongkir</dt>
              <dd className="font-medium">{formatIDR(shipping)}</dd>
            </div>
            <div className="my-3 gold-divider" />
            <div className="flex items-baseline justify-between">
              <dt className="font-display text-base font-semibold">Total</dt>
              <dd className="font-display text-2xl font-bold text-primary">{formatIDR(cartTotal + shipping)}</dd>
            </div>
          </dl>
          <button
            onClick={handleCheckout}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow cursor-pointer"
          >
            Lanjut ke Checkout <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Pembayaran: Transfer Bank, QRIS, COD</p>
        </aside>
      </div>
    </div>
  );
}
