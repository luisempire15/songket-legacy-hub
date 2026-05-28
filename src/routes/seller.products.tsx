import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Package, X } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { categories, formatIDR, type Category, type Product } from "@/lib/mockData";

export const Route = createFileRoute("/seller/products")({
  component: SellerProducts,
});

interface FormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  weight: string;
  category: Category;
  material: string;
  image_url: string;
}

const emptyForm: FormState = {
  name: "", description: "", price: "", stock: "", weight: "",
  category: "Songket Palembang", material: "", image_url: "",
};

function SellerProducts() {
  const { user, products, addProduct, updateProduct, deleteProduct } = useApp();
  const myProducts = products.filter((p) => p.seller_id === user?.id);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description, price: String(p.price),
      stock: String(p.stock), weight: String(p.weight),
      category: p.category, material: p.material, image_url: p.image_url,
    });
    setShowForm(true);
  };

  const onImage = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image_url: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.price), stock = Number(form.stock), weight = Number(form.weight);
    if (!form.name || !form.description || !form.material) return toast.error("Lengkapi semua field");
    if (price <= 0 || stock < 0 || weight <= 0) return toast.error("Angka harus valid");
    
    // Fallback to a high-quality default product image if none uploaded
    const imageUrl = form.image_url || "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600";
    
    const payload = {
      name: form.name, description: form.description, price, stock, weight,
      category: form.category, material: form.material, image_url: imageUrl,
      seller_id: user!.id, umkm_name: user!.umkm_name ?? user!.full_name,
    };
    if (editing) {
      updateProduct(editing.id, payload);
      toast.success("Produk diperbarui");
    } else {
      addProduct(payload);
      toast.success("Produk baru ditambahkan");
    }
    setShowForm(false);
  };

  const remove = (p: Product) => {
    if (!window.confirm(`Hapus "${p.name}"?`)) return;
    deleteProduct(p.id);
    toast.success("Produk dihapus");
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Produk</p>
          <h1 className="mt-1 font-display text-3xl font-bold">Produk Saya</h1>
          <p className="mt-1 text-sm text-muted-foreground">{myProducts.length} produk aktif di toko Anda.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow">
          <Plus className="h-4 w-4" /> Tambah Produk
        </button>
      </div>

      {myProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <Package className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-display text-lg font-semibold">Belum ada produk</p>
          <p className="mt-1 text-sm text-muted-foreground">Mulai unggah karya tenun pertama Anda.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Produk</th>
                  <th className="px-4 py-3 text-left">Kategori</th>
                  <th className="px-4 py-3 text-right">Harga</th>
                  <th className="px-4 py-3 text-right">Stok</th>
                  <th className="px-4 py-3 text-right">Terjual</th>
                  <th className="px-4 py-3 text-left">Sertifikat</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image_url} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                        <span className="font-medium line-clamp-2">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">{p.category}</td>
                    <td className="px-4 py-3 text-right font-display font-bold text-primary">{formatIDR(p.price)}</td>
                    <td className="px-4 py-3 text-right">{p.stock}</td>
                    <td className="px-4 py-3 text-right">{p.total_sold}</td>
                    <td className="px-4 py-3">
                      {p.certified ? (
                        <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">Resmi</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => openEdit(p)} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => remove(p)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/60 p-0 backdrop-blur sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-card p-6 sm:rounded-3xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">{editing ? "Edit Produk" : "Tambah Produk Baru"}</h2>
              <button onClick={() => setShowForm(false)} className="rounded-full p-1.5 hover:bg-secondary"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <FormField label="Nama Produk" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <div>
                <Label>Deskripsi</Label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Harga (IDR)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
                <FormField label="Stok" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
                <FormField label="Berat (gram)" type="number" value={form.weight} onChange={(v) => setForm({ ...form, weight: v })} />
                <div>
                  <Label>Kategori</Label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-gold">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <FormField label="Bahan" value={form.material} onChange={(v) => setForm({ ...form, material: v })} placeholder="cth: Sutra & Benang Emas" />
              <div>
                <Label>Foto Produk</Label>
                <div className="flex items-center gap-4">
                  {form.image_url && <img src={form.image_url} alt="" className="h-20 w-20 rounded-lg object-cover" />}
                  <label className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-xl border border-dashed border-border bg-background px-4 text-sm font-medium text-muted-foreground hover:border-gold hover:text-primary">
                    {form.image_url ? "Ganti foto" : "Upload foto"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onImage(e.target.files[0])} />
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="h-12 flex-1 rounded-full border border-border font-medium hover:bg-secondary">Batal</button>
                <button type="submit" className="h-12 flex-[2] rounded-full bg-primary font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow">
                  {editing ? "Simpan Perubahan" : "Tambah Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</label>;
}
function FormField({ label, type = "text", value, onChange, placeholder }: { label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} required
        className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" />
    </div>
  );
}
