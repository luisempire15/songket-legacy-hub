import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthController } from "@/hooks/useAuthController";
import { useOrderController } from "@/hooks/useOrderController";
import { formatIDR, formatDateID } from "@/lib/mockData";
import { toast } from "sonner";
import { ArrowLeft, ShoppingBag, Truck, Calendar, MapPin, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    Pending: { label: "Pending", class: "bg-gold/20 text-primary border border-gold/30" },
    Processing: { label: "Diproses", class: "bg-blue-50 text-blue-700 border border-blue-200" },
    Shipped: { label: "Dikirim", class: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
    Delivered: { label: "Selesai", class: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    Completed: { label: "Selesai", class: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    Cancelled: { label: "Dibatalkan", class: "bg-destructive/10 text-destructive border border-destructive/20" },
  };
  const config = map[status] || { label: status, class: "bg-muted text-muted-foreground" };
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", config.class)}>
      {config.label}
    </span>
  );
}

export default function Orders() {
  const { user } = useAuthController();
  const { orders, fetchBuyerOrders } = useOrderController();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Silakan masuk terlebih dahulu");
      navigate("/login");
    } else {
      fetchBuyerOrders(user.id);
    }
  }, [user, navigate, fetchBuyerOrders]);

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

              {/* Order Tracking Progress Bar */}
              <div className="border-b border-border bg-card px-6 py-6 sm:px-12">
                <div className="relative flex items-center justify-between">
                  {/* Progress Line */}
                  <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-secondary">
                    <div 
                      className="h-full bg-gold transition-all duration-500" 
                      style={{ 
                        width: order.status === "Pending" ? "0%" :
                               order.status === "Processing" ? "33.3%" :
                               order.status === "Shipped" ? "66.6%" :
                               order.status === "Delivered" || order.status === "Completed" ? "100%" : "0%"
                      }} 
                    />
                  </div>

                  {/* Steps */}
                  {[
                    { label: "Menunggu", statusKey: "Pending" },
                    { label: "Diproses", statusKey: "Processing" },
                    { label: "Dikirim", statusKey: "Shipped" },
                    { label: "Selesai", statusKey: "Completed" }
                  ].map((step, idx) => {
                    const statusOrder = ["Pending", "Processing", "Shipped", "Delivered", "Completed"];
                    
                    let currentStatus = order.status;
                    if (currentStatus === "Delivered") currentStatus = "Completed";
                    
                    const currentIdx = statusOrder.indexOf(currentStatus);
                    let stepIdx = statusOrder.indexOf(step.statusKey);
                    if (step.statusKey === "Completed") stepIdx = 3; 

                    const isCompleted = currentIdx >= stepIdx && order.status !== "Cancelled";
                    const isActive = currentIdx === stepIdx && order.status !== "Cancelled";

                    return (
                      <div key={step.label} className="relative z-10 flex flex-col items-center">
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 text-xs font-bold shadow-sm",
                          isCompleted 
                            ? "border-gold bg-gold text-gold-foreground" 
                            : "border-border bg-card text-muted-foreground"
                        )}>
                          {isCompleted ? "✓" : idx + 1}
                        </div>
                        <span className={cn(
                          "absolute top-10 text-[9px] font-semibold uppercase tracking-wider text-center",
                          isActive ? "text-primary font-bold" : "text-muted-foreground"
                        )}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="h-6" />
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
