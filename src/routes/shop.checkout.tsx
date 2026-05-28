import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { formatIDR } from "@/lib/mockData";
import { toast } from "sonner";
import { ArrowLeft, MapPin, CreditCard, ShoppingBag, Landmark, Banknote, QrCode } from "lucide-react";

export const Route = createFileRoute("/shop/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Dekranasda Sumsel" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cart, cartTotal, checkout, user } = useApp();
  const navigate = useNavigate();

  const [address, setAddress] = useState("Jl. Merdeka 12, Palembang");
  const [payment, setPayment] = useState("Transfer Bank");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shipping = cart.length > 0 ? 25000 : 0;
  const total = cartTotal + shipping;

  // Protect client-side
  useEffect(() => {
    if (!user) {
      toast.error("Silakan masuk terlebih dahulu");
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  if (!user) return null;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-9 w-9 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Keranjang belanja kosong</h1>
        <p className="mt-2 text-muted-foreground">Tambahkan produk ke keranjang untuk melakukan checkout.</p>
        <Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow">
          Kembali ke Koleksi
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      return toast.error("Alamat pengiriman wajib diisi!");
    }
    
    setIsSubmitting(true);
    
    // Simulate slight delay for premium feel
    setTimeout(() => {
      try {
        const order = checkout(address, payment);
        if (order) {
          toast.success(`Pesanan ${order.id} sukses dibuat!`);
          navigate({ to: "/shop/orders" });
        } else {
          toast.error("Gagal memproses checkout.");
        }
      } catch (err) {
        console.error("Checkout error:", err);
        toast.error("Terjadi kesalahan saat memproses pesanan.");
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-14">
      <Link to="/cart" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Keranjang
      </Link>
      
      <h1 className="mb-8 font-display text-3xl font-bold sm:text-4xl">Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {/* Shipping Section */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-bold text-foreground">Alamat Pengiriman</h2>
            </div>
            
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Detail Alamat
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={3}
                placeholder="Masukkan alamat lengkap pengiriman..."
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              />
            </div>
          </div>

          {/* Payment Section */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-bold text-foreground">Metode Pembayaran</h2>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-3">
              <PaymentOption
                active={payment === "Transfer Bank"}
                onClick={() => setPayment("Transfer Bank")}
                icon={<Landmark className="h-5 w-5" />}
                label="Transfer Bank"
                desc="Virtual Account"
              />
              <PaymentOption
                active={payment === "QRIS"}
                onClick={() => setPayment("QRIS")}
                icon={<QrCode className="h-5 w-5" />}
                label="QRIS"
                desc="E-Wallet & M-Banking"
              />
              <PaymentOption
                active={payment === "COD"}
                onClick={() => setPayment("COD")}
                icon={<Banknote className="h-5 w-5" />}
                label="COD"
                desc="Bayar di Tempat"
              />
            </div>
          </div>

          {/* Cart Items Section */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Detail Produk</h2>
            <ul className="divide-y divide-border">
              {cart.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <img src={product.image_url} alt={product.name} className="h-16 w-16 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm text-foreground truncate">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.umkm_name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-muted-foreground">{qty} × {formatIDR(product.price)}</span>
                      <span className="text-sm font-semibold text-foreground">{formatIDR(product.price * qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold">Ringkasan Pesanan</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal Produk</dt>
              <dd className="font-medium">{formatIDR(cartTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Biaya Pengiriman</dt>
              <dd className="font-medium">{formatIDR(shipping)}</dd>
            </div>
            <div className="my-3 gold-divider" />
            <div className="flex items-baseline justify-between">
              <dt className="font-display text-base font-semibold">Total Pembayaran</dt>
              <dd className="font-display text-2xl font-bold text-primary">{formatIDR(total)}</dd>
            </div>
          </dl>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Memproses...
              </span>
            ) : (
              "Buat Pesanan / Place Order"
            )}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Dengan membuat pesanan, Anda menyetujui syarat & ketentuan Dekranasda Sumsel.</p>
        </aside>
      </form>
    </div>
  );
}

function PaymentOption({ active, onClick, icon, label, desc }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all cursor-pointer ${
        active 
          ? "border-primary bg-primary/5 text-primary shadow-elegant" 
          : "border-border bg-background text-foreground/70 hover:border-gold hover:text-primary"
      }`}
    >
      <div className={`p-2 rounded-full mb-2 ${active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
        {icon}
      </div>
      <span className="text-xs font-bold">{label}</span>
      <span className="text-[10px] text-muted-foreground mt-0.5">{desc}</span>
    </button>
  );
}
