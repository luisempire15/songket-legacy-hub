import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { User, Product, Order, Certificate, UmkmApplication } from "../types";
import { ProductService } from "../services/ProductService";
import { OrderService } from "../services/OrderService";
import { CertificateService } from "../services/CertificateService";
import { AuthService } from "../services/AuthService";

export interface CartItem {
  product: Product;
  qty: number;
}

interface AppState {
  // Auth state
  user: User | null;
  setUser: (u: User | null) => void;
  usersList: User[];
  setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
  
  // Cart state
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  cartTotal: number;
  cartCount: number;

  // Global entity lists fetched from backend
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  certificates: Certificate[];
  setCertificates: React.Dispatch<React.SetStateAction<Certificate[]>>;
  umkmApps: UmkmApplication[];
  setUmkmApps: React.Dispatch<React.SetStateAction<UmkmApplication[]>>;
  
  // Loading status
  loading: boolean;
  refreshAll: () => Promise<void>;
}

const Ctx = createContext<AppState | null>(null);

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
  const [usersList, setUsersList] = useState<User[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [umkmApps, setUmkmApps] = useState<UmkmApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  // Sync state from server and load local storage
  const refreshAll = async () => {
    setLoading(true);
    try {
      const prodRes = await ProductService.getAllProducts();
      if (prodRes.success) setProducts(prodRes.products);

      const orderRes = await OrderService.getAllOrders();
      if (orderRes.success) setOrders(orderRes.orders);

      const certRes = await CertificateService.getAllCertificates();
      if (certRes.success) setCertificates(certRes.certificates);

      const umkmRes = await AuthService.getUmkmApplications();
      if (umkmRes.success) setUmkmApps(umkmRes.applications);
    } catch (error) {
      console.error("Failed to load initial data from backend:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      // Restore user session from LocalStorage
      const savedUser = loadLS<User | null>("dekranasda_user", null);
      if (savedUser) {
        setUser(savedUser);
      }

      // Load items from API first
      await refreshAll();

      // Retrieve local cart and map to backend products
      const savedCartIds = loadLS<{ id: string; qty: number }[]>("dekranasda_cart", []);
      setCart((prevCart) => {
        return savedCartIds
          .map((item) => {
            // Find in loaded products
            // Note: products will have loaded by now since we awaited refreshAll()
            // We use the state variable inside the functional setter or let it resolve
            return null;
          })
          .filter(Boolean) as CartItem[];
      });

      setHydrated(true);
    };
    init();
  }, []);

  // Sync local cart mapped when products load
  useEffect(() => {
    if (products.length === 0 || !hydrated) return;
    const savedCartIds = loadLS<{ id: string; qty: number }[]>("dekranasda_cart", []);
    const loadedCart: CartItem[] = [];
    for (const item of savedCartIds) {
      const p = products.find((x) => x.id === item.id);
      if (p) {
        loadedCart.push({ product: p, qty: item.qty });
      }
    }
    setCart(loadedCart);
  }, [products, hydrated]);

  // Persist user and cart to localStorage
  useEffect(() => {
    if (!hydrated) return;
    if (user) {
      localStorage.setItem("dekranasda_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("dekranasda_user");
    }
  }, [user, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      "dekranasda_cart",
      JSON.stringify(cart.map((c) => ({ id: c.product.id, qty: c.qty })))
    );
  }, [cart, hydrated]);

  const value = useMemo<AppState>(() => {
    const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
    const cartCount = cart.reduce((s, i) => s + i.qty, 0);

    return {
      user,
      setUser,
      usersList,
      setUsersList,
      cart,
      setCart,
      cartTotal,
      cartCount,
      products,
      setProducts,
      orders,
      setOrders,
      certificates,
      setCertificates,
      umkmApps,
      setUmkmApps,
      loading,
      refreshAll,
    };
  }, [user, usersList, cart, products, orders, certificates, umkmApps, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be inside AppProvider");
  return v;
}
