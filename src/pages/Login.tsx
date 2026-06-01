import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthController } from "@/hooks/useAuthController";

export default function Login() {
  const { login, logout } = useAuthController();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [tempUser, setTempUser] = useState<any>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const u = await login(email, password);
      if (!u) return toast.error("Email atau password salah");
      setTempUser(u);
      setShowOtp(true);
      toast.info("Kode OTP telah dikirim ke email Anda. (Gunakan 1234 untuk demo)");
    } catch (err: any) {
      toast.error(err.message || "Email atau password salah");
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode === "1234") {
      toast.success(`Selamat datang, ${tempUser.full_name.split(" ")[0]}!`);
      setShowOtp(false);
      if (tempUser.role === "admin") navigate("/admin");
      else if (tempUser.role === "seller") navigate("/seller");
      else navigate("/shop");
    } else {
      toast.error("Kode OTP salah! Silakan coba lagi.");
      logout();
      setTempUser(null);
      setShowOtp(false);
      setOtpCode("");
    }
  };

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-10">
      <div className="w-full rounded-3xl border border-border bg-card p-8 shadow-elegant sm:p-10">
        {!showOtp ? (
          <>
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
              <button type="submit" className="h-12 w-full rounded-full bg-primary font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow cursor-pointer">
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
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-elegant">
                <span className="font-display text-2xl font-bold">OTP</span>
              </div>
              <h1 className="mt-5 font-display text-2xl font-bold">Verifikasi OTP</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Masukkan 4 digit kode OTP yang dikirim ke email Anda <span className="font-semibold">{email}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="mt-8 space-y-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">Kode OTP</label>
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="1234"
                  required
                  className="h-14 w-full text-center text-2xl font-mono tracking-[1.2em] pl-[1.2em] rounded-xl border border-border bg-background outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
                />
              </div>
              <button type="submit" className="h-12 w-full rounded-full bg-primary font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow cursor-pointer">
                Verifikasi & Masuk
              </button>
              <button 
                type="button" 
                onClick={() => {
                  logout();
                  setShowOtp(false);
                  setOtpCode("");
                }} 
                className="w-full text-center text-xs font-medium text-muted-foreground hover:text-primary hover:underline cursor-pointer"
              >
                Batal
              </button>
            </form>
          </>
        )}
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
