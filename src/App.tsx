import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AppProvider } from "@/context/AppContext";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BottomNav } from "@/components/site/BottomNav";
import { RoleGuard } from "@/components/site/RoleGuard";

// Import Sidebar Layouts
import { SellerSidebar, SellerMobileNav } from "@/components/seller/SellerSidebar";
import { AdminSidebar, AdminMobileNav } from "@/components/admin/AdminSidebar";

// Import General Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// Import Buyer Pages
import Shop from "@/pages/buyer/Shop";
import ProductDetail from "@/pages/buyer/ProductDetail";
import Cart from "@/pages/buyer/Cart";
import Checkout from "@/pages/buyer/Checkout";
import Orders from "@/pages/buyer/Orders";

// Import Seller Pages
import SellerDashboard from "@/pages/seller/SellerDashboard";
import Products from "@/pages/seller/Products";
import SellerOrders from "@/pages/seller/SellerOrders";
import Certification from "@/pages/seller/Certification";

// Import Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUmkm from "@/pages/admin/AdminUmkm";
import AdminTransactions from "@/pages/admin/AdminTransactions";
import AdminCertificates from "@/pages/admin/AdminCertificates";
import AdminBuyers from "@/pages/admin/AdminBuyers";

const queryClient = new QueryClient();

// Root Layout Component
function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col pb-14 sm:pb-0">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <Toaster richColors position="top-center" />
    </div>
  );
}

// Seller Center Layout Component
function SellerLayout() {
  return (
    <RoleGuard roles={["seller"]}>
      <div className="flex">
        <SellerSidebar />
        <div className="min-w-0 flex-1">
          <SellerMobileNav />
          <Outlet />
        </div>
      </div>
    </RoleGuard>
  );
}

// Admin Panel Layout Component
function AdminLayout() {
  return (
    <RoleGuard roles={["admin"]}>
      <div className="flex">
        <AdminSidebar />
        <div className="min-w-0 flex-1">
          <AdminMobileNav />
          <Outlet />
        </div>
      </div>
    </RoleGuard>
  );
}

// 404 Page Component
function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Layout */}
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="shop/product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="shop/checkout" element={<Checkout />} />
              <Route path="shop/orders" element={<Orders />} />
              <Route path="about" element={<About />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* Seller Routes */}
              <Route path="seller" element={<SellerLayout />}>
                <Route index element={<SellerDashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<SellerOrders />} />
                <Route path="certificates" element={<Certification />} />
              </Route>

              {/* Admin Routes */}
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="umkm" element={<AdminUmkm />} />
                <Route path="transactions" element={<AdminTransactions />} />
                <Route path="certificates" element={<AdminCertificates />} />
                <Route path="buyers" element={<AdminBuyers />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}
