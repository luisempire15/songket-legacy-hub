import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RoleGuard } from "@/components/site/RoleGuard";
import { SellerSidebar, SellerMobileNav } from "@/components/seller/SellerSidebar";

export const Route = createFileRoute("/seller")({
  head: () => ({ meta: [{ title: "Seller Center — Dekranasda Sumsel" }] }),
  component: SellerLayout,
});

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
