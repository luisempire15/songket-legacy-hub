import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="gold-divider" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold text-gold-foreground">
              <span className="font-display text-lg font-bold">D</span>
            </div>
            <div>
              <div className="font-display text-lg font-bold">Dekranasda</div>
              <div className="text-[10px] uppercase tracking-widest text-primary-foreground/70">Sumatera Selatan</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/75">
            Marketplace resmi UMKM Songket dan tenun tradisional khas Sumatera Selatan, dibina langsung oleh Dekranasda.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">Jelajahi</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/80">
            <li><Link to="/shop" className="hover:text-gold">Semua Koleksi</Link></li>
            <li><Link to="/shop" className="hover:text-gold">Songket Palembang</Link></li>
            <li><Link to="/shop" className="hover:text-gold">Jumputan</Link></li>
            <li><Link to="/shop" className="hover:text-gold">Tajung & Blongsong</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">UMKM</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/80">
            <li><Link to="/register" className="hover:text-gold">Daftar Sebagai Penjual</Link></li>
            <li><Link to="/about" className="hover:text-gold">Program Pembinaan</Link></li>
            <li><Link to="/about" className="hover:text-gold">Sertifikasi Produk</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">Hubungi Kami</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> Jl. Demang Lebar Daun, Palembang</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> info@dekranasda-sumsel.id</li>
            <li className="flex items-center gap-3 pt-2">
              <a href="#" className="rounded-full bg-primary-foreground/10 p-2 hover:bg-gold hover:text-gold-foreground"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="rounded-full bg-primary-foreground/10 p-2 hover:bg-gold hover:text-gold-foreground"><Facebook className="h-4 w-4" /></a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-primary-foreground/60 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} Dekranasda Sumatera Selatan. Hak cipta dilindungi.</p>
          <p>Dibina oleh Pemerintah Provinsi Sumatera Selatan</p>
        </div>
      </div>
    </footer>
  );
}
