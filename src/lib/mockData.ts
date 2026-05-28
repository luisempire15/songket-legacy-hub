import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";

export type Category = "Songket Palembang" | "Jumputan" | "Tajung" | "Blongsong";

export interface Product {
  id: string;
  name: string;
  umkm_name: string;
  description: string;
  price: number;
  original_price?: number;
  stock: number;
  category: Category;
  material: string;
  weight: number;
  image_url: string;
  rating: number;
  total_reviews: number;
  total_sold: number;
}

const images = [p1, p2, p3, p4, p5, p6];

const baseProducts: Omit<Product, "id" | "image_url">[] = [
  {
    name: "Songket Lepus Emas Klasik",
    umkm_name: "Toko Sriwijaya Jaya",
    description:
      "Songket Palembang tradisional dengan motif Lepus dan benang emas asli. Ditenun tangan oleh pengrajin berpengalaman selama lebih dari 2 bulan. Cocok untuk acara pernikahan dan upacara adat.",
    price: 3850000,
    original_price: 4500000,
    stock: 5,
    category: "Songket Palembang",
    material: "Sutra & Benang Emas",
    weight: 850,
    rating: 4.9,
    total_reviews: 128,
    total_sold: 312,
  },
  {
    name: "Selendang Jumputan Sekar Jagad",
    umkm_name: "Rumah Jumputan Ratu",
    description: "Selendang Jumputan tie-dye dengan pewarna alami. Motif Sekar Jagad yang elegan untuk busana sehari-hari maupun formal.",
    price: 285000,
    stock: 24,
    category: "Jumputan",
    material: "Katun Premium",
    weight: 220,
    rating: 4.7,
    total_reviews: 89,
    total_sold: 540,
  },
  {
    name: "Sarung Tajung Pucuk Rebung",
    umkm_name: "Tenun Musi Indah",
    description: "Sarung Tajung khas Palembang dengan motif Pucuk Rebung. Tenunan rapi dengan warna yang awet dan tidak mudah luntur.",
    price: 650000,
    stock: 12,
    category: "Tajung",
    material: "Katun Sutra",
    weight: 480,
    rating: 4.8,
    total_reviews: 56,
    total_sold: 178,
  },
  {
    name: "Songket Blongsong Bunga Cina",
    umkm_name: "Galeri Wong Kito",
    description: "Songket Blongsong dengan motif Bunga Cina khas, padu padan benang emas dan sutra merah marun. Pilihan favorit untuk acara resepsi.",
    price: 2750000,
    stock: 8,
    category: "Blongsong",
    material: "Sutra Premium",
    weight: 720,
    rating: 4.9,
    total_reviews: 94,
    total_sold: 201,
  },
  {
    name: "Songket Tabur Bintang Emas",
    umkm_name: "Toko Sriwijaya Jaya",
    description: "Motif Tabur Bintang dengan taburan benang emas merata. Ringan namun tetap berkelas, cocok untuk syal atau kain panjang.",
    price: 1850000,
    stock: 15,
    category: "Songket Palembang",
    material: "Sutra & Benang Emas",
    weight: 560,
    rating: 4.8,
    total_reviews: 72,
    total_sold: 156,
  },
  {
    name: "Kain Jumputan Pelangi",
    umkm_name: "Rumah Jumputan Ratu",
    description: "Jumputan modern dengan gradasi warna pelangi. Cocok untuk gaun dan baju kondangan dengan sentuhan tradisional.",
    price: 425000,
    original_price: 525000,
    stock: 30,
    category: "Jumputan",
    material: "Katun Premium",
    weight: 280,
    rating: 4.6,
    total_reviews: 142,
    total_sold: 689,
  },
  {
    name: "Songket Limar Tuah Emas",
    umkm_name: "Galeri Wong Kito",
    description: "Songket Limar dengan motif tuah yang dipercaya membawa keberuntungan. Detail benang emas yang sangat halus.",
    price: 4250000,
    stock: 3,
    category: "Songket Palembang",
    material: "Sutra Tenun Tangan",
    weight: 920,
    rating: 5.0,
    total_reviews: 38,
    total_sold: 67,
  },
  {
    name: "Sarung Tajung Garis Klasik",
    umkm_name: "Tenun Musi Indah",
    description: "Sarung Tajung garis klasik dengan kombinasi warna maroon dan emas. Pilihan abadi untuk ibadah dan acara formal.",
    price: 485000,
    stock: 22,
    category: "Tajung",
    material: "Katun Sutra",
    weight: 420,
    rating: 4.7,
    total_reviews: 64,
    total_sold: 234,
  },
  {
    name: "Songket Blongsong Lepus Mini",
    umkm_name: "Galeri Wong Kito",
    description: "Versi ringan dari Blongsong Lepus, cocok untuk acara semi-formal. Motif klasik dengan harga lebih terjangkau.",
    price: 1450000,
    stock: 10,
    category: "Blongsong",
    material: "Katun Sutra",
    weight: 480,
    rating: 4.7,
    total_reviews: 51,
    total_sold: 119,
  },
  {
    name: "Selendang Jumputan Sogan",
    umkm_name: "Rumah Jumputan Ratu",
    description: "Selendang Jumputan warna sogan klasik dengan motif tradisional. Pewarna alami dari kulit kayu pohon soga.",
    price: 195000,
    stock: 40,
    category: "Jumputan",
    material: "Katun",
    weight: 180,
    rating: 4.5,
    total_reviews: 203,
    total_sold: 812,
  },
  {
    name: "Songket Tretes Mender Emas",
    umkm_name: "Toko Sriwijaya Jaya",
    description: "Songket Tretes Mender dengan motif geometris penuh wibawa. Pilihan utama untuk mempelai pria atau wanita.",
    price: 5250000,
    stock: 2,
    category: "Songket Palembang",
    material: "Sutra Tenun Tangan",
    weight: 980,
    rating: 5.0,
    total_reviews: 24,
    total_sold: 41,
  },
  {
    name: "Sarung Tajung Lurik Sumsel",
    umkm_name: "Tenun Musi Indah",
    description: "Sarung Tajung lurik kontemporer, nyaman dipakai sehari-hari namun tetap menampilkan kekhasan budaya Sumsel.",
    price: 385000,
    stock: 28,
    category: "Tajung",
    material: "Katun",
    weight: 380,
    rating: 4.6,
    total_reviews: 87,
    total_sold: 298,
  },
];

export const products: Product[] = baseProducts.map((p, i) => ({
  ...p,
  id: `prod-${(i + 1).toString().padStart(3, "0")}`,
  image_url: images[i % images.length],
}));

export const categories: Category[] = ["Songket Palembang", "Jumputan", "Tajung", "Blongsong"];

export function formatIDR(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}
