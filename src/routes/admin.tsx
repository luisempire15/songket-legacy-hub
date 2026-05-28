import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RoleGuard } from "@/components/site/RoleGuard";
import { AdminSidebar, AdminMobileNav } from "@/components/admin/AdminSidebar";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Dekranasda Sumsel" }] }),
  component: AdminLayout,
});

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
