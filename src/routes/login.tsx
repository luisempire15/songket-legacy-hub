import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Masuk — Dekranasda Sumsel" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = login(email, password);
    if (!u) return toast.error("Email atau password salah");
    toast.success(`Selamat datang, ${u.full_name.split(" ")[0]}!`);
    navigate({ to: "/shop" });
  };

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-10">
      <div className="w-full rounded-3xl border border-border bg-card p-8 shadow-elegant sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-elegant">
            <span className="font-display text-2xl font-bold">D</span>
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold">Selamat Datang Kembali</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Masuk ke akun Dekranasda Sumsel Anda</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="nama@email.com" />
          <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
          <button type="submit" className="h-12 w-full rounded-full bg-primary font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow">
            Masuk
          </button>
        </form>

        <div className="mt-6 rounded-xl bg-secondary p-4 text-xs text-secondary-foreground">
          <p className="font-semibold">Akun Demo:</p>
          <p className="mt-1.5">Admin: <code>admin@dekranasda.go.id</code> / <code>admin123</code></p>
          <p>Penjual: <code>toko.sriwijaya@gmail.com</code> / <code>seller123</code></p>
          <p>Pembeli: <code>budi.santoso@gmail.com</code> / <code>buyer123</code></p>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, ...rest }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  const { onChange, ...inputProps } = rest;
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        {...inputProps}
        onChange={(e) => onChange(e.target.value)}
        required
        className="h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
      />
    </div>
  );
}
