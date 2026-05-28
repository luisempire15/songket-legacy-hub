import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products as seedProducts, type Product } from "@/lib/mockData";

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
  user: User | null;
  login: (email: string, password: string) => User | null;
  register: (data: Omit<User, "id"> & { password: string }) => User;
  logout: () => void;
  cart: CartItem[];
  addToCart: (p: Product, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const Ctx = createContext<AppState | null>(null);

const SEED_USERS: Array<User & { password: string }> = [
  { id: "u-admin", full_name: "Admin Dekranasda", email: "admin@dekranasda.go.id", password: "admin123", role: "admin" },
  { id: "u-seller", full_name: "Toko Sriwijaya", email: "toko.sriwijaya@gmail.com", password: "seller123", role: "seller", umkm_name: "Toko Sriwijaya Jaya" },
  { id: "u-buyer", full_name: "Budi Santoso", email: "budi.santoso@gmail.com", password: "buyer123", role: "buyer" },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [users, setUsers] = useState(SEED_USERS);

  useEffect(() => {
    try {
      const u = localStorage.getItem("dekranasda_user");
      const c = localStorage.getItem("dekranasda_cart");
      if (u) setUser(JSON.parse(u));
      if (c) {
        const ids: { id: string; qty: number }[] = JSON.parse(c);
        setCart(
          ids
            .map((i) => {
              const p = seedProducts.find((x) => x.id === i.id);
              return p ? { product: p, qty: i.qty } : null;
            })
            .filter(Boolean) as CartItem[],
        );
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("dekranasda_user", JSON.stringify(user));
    else localStorage.removeItem("dekranasda_user");
  }, [user]);

  useEffect(() => {
    localStorage.setItem(
      "dekranasda_cart",
      JSON.stringify(cart.map((c) => ({ id: c.product.id, qty: c.qty }))),
    );
  }, [cart]);

  const value = useMemo<AppState>(() => {
    const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
    const cartCount = cart.reduce((s, i) => s + i.qty, 0);
    return {
      user,
      login: (email, password) => {
        const found = users.find((u) => u.email === email && u.password === password);
        if (found) {
          const { password: _, ...safe } = found;
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
        const { password: _, ...safe } = newUser;
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
    };
  }, [user, cart, users]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be inside AppProvider");
  return v;
}
