import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  seedProducts,
  seedOrders,
  seedCertificates,
  seedUmkmApps,
  type Product,
  type Order,
  type OrderItem,
  type OrderStatus,
  type CertificateRequest,
  type CertStatus,
  type UmkmApplication,
  type UmkmStatus,
} from "@/lib/mockData";

export type Role = "buyer" | "seller" | "admin";
export interface User {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  umkm_name?: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

interface AppState {
  // auth
  user: User | null;
  login: (email: string, password: string) => User | null;
  register: (data: Omit<User, "id"> & { password: string }) => User;
  logout: () => void;
  // cart
  cart: CartItem[];
  addToCart: (p: Product, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  // products
  products: Product[];
  addProduct: (p: Omit<Product, "id" | "rating" | "total_reviews" | "total_sold" | "certified">) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // orders
  orders: Order[];
  checkout: (address: string, payment: string) => Order | null;
  updateOrderStatus: (id: string, status: OrderStatus, tracking?: string) => void;
  // certificates
  certificates: CertificateRequest[];
  requestCertificate: (data: Omit<CertificateRequest, "id" | "status" | "created_at">) => void;
  reviewCertificate: (id: string, status: CertStatus, reason?: string) => void;
  // umkm applications
  umkmApps: UmkmApplication[];
  reviewUmkm: (id: string, status: UmkmStatus) => void;
}

const Ctx = createContext<AppState | null>(null);

const SEED_USERS: Array<User & { password: string }> = [
  { id: "u-admin", full_name: "Admin Dekranasda", email: "admin@dekranasda.go.id", password: "admin123", role: "admin" },
  { id: "u-seller", full_name: "Toko Sriwijaya", email: "toko.sriwijaya@gmail.com", password: "seller123", role: "seller", umkm_name: "Toko Sriwijaya Jaya" },
  { id: "u-buyer", full_name: "Budi Santoso", email: "budi.santoso@gmail.com", password: "buyer123", role: "buyer" },
];

function loadLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [users, setUsers] = useState(SEED_USERS);
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [certificates, setCertificates] = useState<CertificateRequest[]>(seedCertificates);
  const [umkmApps, setUmkmApps] = useState<UmkmApplication[]>(seedUmkmApps);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage AFTER mount to avoid SSR mismatch
  useEffect(() => {
    setUser(loadLS<User | null>("dekranasda_user", null));
    const cartIds = loadLS<{ id: string; qty: number }[]>("dekranasda_cart", []);
    const storedProducts = loadLS<Product[] | null>("dekranasda_products", null);
    if (storedProducts) setProducts(storedProducts);
    setOrders(loadLS<Order[]>("dekranasda_orders", seedOrders));
    setCertificates(loadLS<CertificateRequest[]>("dekranasda_certs", seedCertificates));
    setUmkmApps(loadLS<UmkmApplication[]>("dekranasda_umkm", seedUmkmApps));
    const productSource = storedProducts ?? seedProducts;
    setCart(
      cartIds
        .map((i) => {
          const p = productSource.find((x) => x.id === i.id);
          return p ? { product: p, qty: i.qty } : null;
        })
        .filter(Boolean) as CartItem[],
    );
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (user) localStorage.setItem("dekranasda_user", JSON.stringify(user));
    else localStorage.removeItem("dekranasda_user");
  }, [user, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("dekranasda_cart", JSON.stringify(cart.map((c) => ({ id: c.product.id, qty: c.qty }))));
  }, [cart, hydrated]);

  useEffect(() => { if (hydrated) localStorage.setItem("dekranasda_products", JSON.stringify(products)); }, [products, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("dekranasda_orders", JSON.stringify(orders)); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("dekranasda_certs", JSON.stringify(certificates)); }, [certificates, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("dekranasda_umkm", JSON.stringify(umkmApps)); }, [umkmApps, hydrated]);

  const value = useMemo<AppState>(() => {
    const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
    const cartCount = cart.reduce((s, i) => s + i.qty, 0);
    return {
      user,
      login: (email, password) => {
        const found = users.find((u) => u.email === email && u.password === password);
        if (found) {
          const { password: _p, ...safe } = found;
          setUser(safe);
          return safe;
        }
        return null;
      },
      register: (data) => {
        const newUser: User & { password: string } = {
          id: `u-${Date.now()}`,
          full_name: data.full_name,
          email: data.email,
          role: data.role,
          umkm_name: data.umkm_name,
          password: data.password,
        };
        setUsers((u) => [...u, newUser]);
        const { password: _p, ...safe } = newUser;
        setUser(safe);
        return safe;
      },
      logout: () => setUser(null),
      cart,
      addToCart: (p, qty = 1) =>
        setCart((prev) => {
          const existing = prev.find((i) => i.product.id === p.id);
          if (existing) return prev.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + qty } : i));
          return [...prev, { product: p, qty }];
        }),
      updateQty: (id, qty) =>
        setCart((prev) => prev.map((i) => (i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i))),
      removeFromCart: (id) => setCart((prev) => prev.filter((i) => i.product.id !== id)),
      clearCart: () => setCart([]),
      cartTotal,
      cartCount,

      products,
      addProduct: (p) => {
        const newP: Product = {
          ...p,
          id: `prod-${Date.now()}`,
          rating: 0,
          total_reviews: 0,
          total_sold: 0,
          certified: false,
        };
        setProducts((prev) => [newP, ...prev]);
        return newP;
      },
      updateProduct: (id, patch) =>
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
      deleteProduct: (id) => setProducts((prev) => prev.filter((p) => p.id !== id)),

      orders,
      checkout: (address, payment) => {
        if (!user || cart.length === 0) return null;
        const items: OrderItem[] = cart.map((c) => ({
          product_id: c.product.id,
          product_name: c.product.name,
          umkm_name: c.product.umkm_name,
          seller_id: c.product.seller_id,
          qty: c.qty,
          price: c.product.price,
          image_url: c.product.image_url,
        }));
        const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
        const shipping = 25000;
        const order: Order = {
          id: `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(4, "0")}`,
          buyer_id: user.id,
          buyer_name: user.full_name,
          items,
          subtotal,
          shipping,
          total: subtotal + shipping,
          status: "Pending",
          shipping_address: address,
          payment_method: payment,
          created_at: new Date().toISOString(),
        };
        setOrders((prev) => [order, ...prev]);
        setCart([]);
        return order;
      },
      updateOrderStatus: (id, status, tracking) =>
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status, tracking_number: tracking ?? o.tracking_number } : o)),
        ),

      certificates,
      requestCertificate: (data) => {
        const c: CertificateRequest = {
          ...data,
          id: `CERT-${Date.now()}`,
          status: "Pending",
          created_at: new Date().toISOString(),
        };
        setCertificates((prev) => [c, ...prev]);
      },
      reviewCertificate: (id, status, reason) => {
        setCertificates((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status, rejection_reason: reason } : c)),
        );
        const cert = certificates.find((c) => c.id === id);
        if (cert && status === "Approved") {
          setProducts((prev) => prev.map((p) => (p.id === cert.product_id ? { ...p, certified: true } : p)));
        } else if (cert && status === "Rejected") {
          setProducts((prev) => prev.map((p) => (p.id === cert.product_id ? { ...p, certified: false } : p)));
        }
      },

      umkmApps,
      reviewUmkm: (id, status) =>
        setUmkmApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a))),
    };
  }, [user, cart, users, products, orders, certificates, umkmApps]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be inside AppProvider");
  return v;
}
