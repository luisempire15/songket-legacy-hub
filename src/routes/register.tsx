import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag, Store, Check } from "lucide-react";
import { toast } from "sonner";
import { useApp, type Role } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Daftar — Dekranasda Sumsel" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>("buyer");
  const [form, setForm] = useState({ full_name: "", email: "", password: "", umkm_name: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || form.password.length < 6) {
      return toast.error("Lengkapi data dengan benar (password min. 6 karakter)");
    }
    if (role === "seller" && !form.umkm_name) {
      return toast.error("Nama UMKM wajib diisi");
    }
    register({ ...form, role });
    if (role === "seller") {
      toast.success("Pendaftaran berhasil! Akun Anda akan diverifikasi dalam 1–3 hari kerja.");
    } else {
      toast.success(`Selamat datang, ${form.full_name.split(" ")[0]}!`);
    }
    navigate({ to: "/shop" });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-elegant sm:p-10">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">Daftar Akun</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Bergabung dengan komunitas Dekranasda Sumsel</p>
        </div>

        {/* stepper */}
        <ol className="mt-8 flex items-center justify-center gap-2">
          {[1, 2].map((n) => (
            <li key={n} className="flex items-center gap-2">
              <span className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold", step >= n ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>
                {step > n ? <Check className="h-4 w-4" /> : n}
              </span>
              {n < 2 && <span className={cn("h-px w-12", step > n ? "bg-primary" : "bg-border")} />}
            </li>
          ))}
        </ol>

        {step === 1 ? (
          <div className="mt-8 space-y-4">
            <p className="text-center text-sm font-medium text-foreground">Saya mendaftar sebagai</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <RoleCard active={role === "buyer"} onClick={() => setRole("buyer")} Icon={ShoppingBag} title="Pembeli" desc="Belanja produk Songket asli" />
              <RoleCard active={role === "seller"} onClick={() => setRole("seller")} Icon={Store} title="Penjual UMKM" desc="Jual produk tenun Anda" />
            </div>
            <button onClick={() => setStep(2)} className="mt-4 h-12 w-full rounded-full bg-primary font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow">
              Lanjut
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <Field label="Nama Lengkap" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Password (min. 6 karakter)" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
            {role === "seller" && (
              <Field label="Nama UMKM / Toko" value={form.umkm_name} onChange={(v) => setForm({ ...form, umkm_name: v })} />
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setStep(1)} className="h-12 flex-1 rounded-full border border-border font-medium text-foreground hover:bg-secondary">
                Kembali
              </button>
              <button type="submit" className="h-12 flex-[2] rounded-full bg-primary font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow">
                Daftar sebagai {role === "buyer" ? "Pembeli" : "Penjual"}
              </button>
            </div>
            {role === "seller" && (
              <p className="text-center text-xs text-muted-foreground">
                Akun Anda akan diverifikasi oleh Dekranasda dalam 1–3 hari kerja.
              </p>
            )}
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}

function RoleCard({ active, onClick, Icon, title, desc }: { active: boolean; onClick: () => void; Icon: typeof Store; title: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border-2 p-6 text-center transition-all",
        active ? "border-gold bg-gold/5 shadow-gold" : "border-border bg-background hover:border-gold/50",
      )}
    >
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground")}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="font-display text-base font-semibold">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </button>
  );
}

function Field({ label, type = "text", value, onChange }: { label: string; type?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
      />
    </div>
  );
}
