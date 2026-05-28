import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useApp, type Role } from "@/context/AppContext";

export function RoleGuard({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!user) {
      navigate({ to: "/login" });
    } else if (!roles.includes(user.role)) {
      navigate({ to: "/" });
    }
  }, [user, roles, navigate]);

  if (!user || !roles.includes(user.role)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-32 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Memeriksa akses...</p>
      </div>
    );
  }
  return <>{children}</>;
}
