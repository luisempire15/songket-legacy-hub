import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { formatIDR, formatDateID } from "@/lib/mockData";
import { toast } from "sonner";
import { ArrowLeft, ShoppingBag, Truck, Calendar, MapPin, CreditCard } from "lucide-react";
import { OrderStatusBadge } from "@/pages/admin/AdminTransactions";

export default function Orders() {
  const { orders, user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Silakan masuk terlebih dahulu");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const myOrders = orders.filter((o) => o.buyer_id === user.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8 lg:py-14">
      <Link to="/shop" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Koleksi
      </Link>

      <div className="mb-8 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Akun Saya</p>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Riwayat Pesanan</h1>
        <p className="text-sm text-muted-foreground">Temukan riwayat pesanan Songket tenunan Anda di bawah ini.</p>
      </div>

      {myOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 font-display text-lg font-semibold">Belum ada pesanan</p>
          <p className="mt-1 text-sm text-muted-foreground">Anda belum melakukan pemesanan produk tenun apa pun.</p>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-border bg-card overflow-hidden shadow-elegant transition-all hover:border-gold/50">
              {/* Order Header */}
              <div className="border-b border-border bg-secondary/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="font-display font-bold text-foreground">{order.id}</span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDateID(order.created_at)}
                  </span>
                </div>
                <div>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                  {/* Items List */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Daftar Produk</h3>
                    <ul className="divide-y divide-border/60">
                      {order.items.map((item, idx) => (
                        <li key={`${item.product_id}-${idx}`} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                          <img src={item.image_url} alt={item.product_name} className="h-14 w-14 rounded-lg object-cover shrink-0 border border-border" />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm text-foreground truncate hover:text-primary transition-colors">
                              <Link to={`/shop/product/${item.product_id}`}>
                                {item.product_name}
                              </Link>
                            </h4>
                            <p className="text-xs text-muted-foreground">{item.umkm_name}</p>
                            <span className="text-xs text-muted-foreground">{item.qty} × {formatIDR(item.price)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-4 border-t border-border pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-6">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> Alamat Pengiriman
                      </h3>
                      <p className="text-xs text-foreground/80 leading-relaxed">{order.shipping_address}</p>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                        <CreditCard className="h-3.5 w-3.5" /> Pembayaran
                      </h3>
                      <p className="text-xs text-foreground/80 leading-relaxed">{order.payment_method}</p>
                    </div>

                    {order.tracking_number && (
                      <div className="rounded-xl bg-primary/5 border border-primary/10 p-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 flex items-center gap-1">
                          <Truck className="h-3.5 w-3.5" /> Info Resi Pengiriman
                        </h3>
                        <p className="text-xs font-bold text-foreground select-all">{order.tracking_number}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Pembayaran:</span>
                  <span className="font-display text-xl font-bold text-primary">{formatIDR(order.total)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
