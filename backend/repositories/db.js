// Mock database container representing our server state
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { Certificate } from "../models/Certificate.js";

// Users seed
const SEED_USERS = [
  { id: "u-admin", full_name: "Admin Dekranasda", email: "admin@dekranasda.go.id", password: "admin123", role: "admin" },
  { id: "u-seller", full_name: "Toko Sriwijaya", email: "toko.sriwijaya@gmail.com", password: "seller123", role: "seller", umkm_name: "Toko Sriwijaya Jaya" },
  { id: "u-buyer", full_name: "Budi Santoso", email: "budi.santoso@gmail.com", password: "buyer123", role: "buyer" },
];

const images = [
  "/src/assets/product-1.jpg",
  "/src/assets/product-2.jpg",
  "/src/assets/product-3.jpg",
  "/src/assets/product-4.jpg",
  "/src/assets/product-5.jpg",
  "/src/assets/product-6.jpg"
];

const baseProducts = [
  { name: "Songket Lepus Emas Klasik", umkm_name: "Toko Sriwijaya Jaya", description: "Songket Palembang tradisional dengan motif Lepus dan benang emas asli. Ditenun tangan oleh pengrajin berpengalaman selama lebih dari 2 bulan. Cocok untuk acara pernikahan dan upacara adat.", price: 3850000, original_price: 4500000, stock: 5, category: "Songket Palembang", material: "Sutra & Benang Emas", weight: 850, rating: 4.9, total_reviews: 128, total_sold: 312 },
  { name: "Selendang Jumputan Sekar Jagad", umkm_name: "Rumah Jumputan Ratu", description: "Selendang Jumputan tie-dye dengan pewarna alami. Motif Sekar Jagad yang elegan untuk busana sehari-hari maupun formal.", price: 285000, stock: 24, category: "Jumputan", material: "Katun Premium", weight: 220, rating: 4.7, total_reviews: 89, total_sold: 540 },
  { name: "Sarung Tajung Pucuk Rebung", umkm_name: "Tenun Musi Indah", description: "Sarung Tajung khas Palembang dengan motif Pucuk Rebung. Tenunan rapi dengan warna yang awet dan tidak mudah luntur.", price: 650000, stock: 12, category: "Tajung", material: "Katun Sutra", weight: 480, rating: 4.8, total_reviews: 56, total_sold: 178 },
  { name: "Songket Blongsong Bunga Cina", umkm_name: "Galeri Wong Kito", description: "Songket Blongsong dengan motif Bunga Cina khas, padu padan benang emas dan sutra merah marun. Pilihan favorit untuk acara resepsi.", price: 2750000, stock: 8, category: "Blongsong", material: "Sutra Premium", weight: 720, rating: 4.9, total_reviews: 94, total_sold: 201 },
  { name: "Songket Tabur Bintang Emas", umkm_name: "Toko Sriwijaya Jaya", description: "Motif Tabur Bintang dengan taburan benang emas merata. Ringan namun tetap berkelas, cocok untuk syal atau kain panjang.", price: 1850000, stock: 15, category: "Songket Palembang", material: "Sutra & Benang Emas", weight: 560, rating: 4.8, total_reviews: 72, total_sold: 156 },
  { name: "Kain Jumputan Pelangi", umkm_name: "Rumah Jumputan Ratu", description: "Jumputan modern dengan gradasi warna pelangi. Cocok untuk gaun dan baju kondangan dengan sentuhan tradisional.", price: 425000, original_price: 525000, stock: 30, category: "Jumputan", material: "Katun Premium", weight: 280, rating: 4.6, total_reviews: 142, total_sold: 689 },
  { name: "Songket Limar Tuah Emas", umkm_name: "Galeri Wong Kito", description: "Songket Limar dengan motif tuah yang dipercaya membawa keberuntungan. Detail benang emas yang sangat halus.", price: 4250000, stock: 3, category: "Songket Palembang", material: "Sutra Tenun Tangan", weight: 920, rating: 5.0, total_reviews: 38, total_sold: 67 },
  { name: "Sarung Tajung Garis Klasik", umkm_name: "Tenun Musi Indah", description: "Sarung Tajung garis klasik dengan kombinasi warna maroon and emas. Pilihan abadi untuk ibadah dan acara formal.", price: 485000, stock: 22, category: "Tajung", material: "Katun Sutra", weight: 420, rating: 4.7, total_reviews: 64, total_sold: 234 },
  { name: "Songket Blongsong Lepus Mini", umkm_name: "Galeri Wong Kito", description: "Versi ringan dari Blongsong Lepus, cocok untuk acara semi-formal. Motif klasik dengan harga lebih terjangkau.", price: 1450000, stock: 10, category: "Blongsong", material: "Katun Sutra", weight: 480, rating: 4.7, total_reviews: 51, total_sold: 119 },
  { name: "Selendang Jumputan Sogan", umkm_name: "Rumah Jumputan Ratu", description: "Selendang Jumputan warna sogan klasik dengan motif tradisional. Pewarna alami dari kulit kayu pohon soga.", price: 195000, stock: 40, category: "Jumputan", material: "Katun", weight: 180, rating: 4.5, total_reviews: 203, total_sold: 812 },
  { name: "Songket Tretes Mender Emas", umkm_name: "Toko Sriwijaya Jaya", description: "Songket Tretes Mender dengan motif geometris penuh wibawa. Pilihan utama untuk mempelai pria atau wanita.", price: 5250000, stock: 2, category: "Songket Palembang", material: "Sutra Tenun Tangan", weight: 980, rating: 5.0, total_reviews: 24, total_sold: 41 },
  { name: "Sarung Tajung Lurik Sumsel", umkm_name: "Tenun Musi Indah", description: "Sarung Tajung lurik kontemporer, nyaman dipakai sehari-hari namun tetap menampilkan kekhasan budaya Sumsel.", price: 385000, stock: 28, category: "Tajung", material: "Katun", weight: 380, rating: 4.6, total_reviews: 87, total_sold: 298 },
];

const sellerForUmkm = {
  "Toko Sriwijaya Jaya": "u-seller",
  "Rumah Jumputan Ratu": "u-seller-2",
  "Tenun Musi Indah": "u-seller-3",
  "Galeri Wong Kito": "u-seller-4",
};

// Seeding products
export const products = baseProducts.map((p, i) => new Product({
  ...p,
  id: `prod-${(i + 1).toString().padStart(3, "0")}`,
  image_url: images[i % images.length],
  seller_id: sellerForUmkm[p.umkm_name] ?? "u-seller",
  certified: i === 0 || i === 3 || i === 6,
}));

// Seeding users with passwords included for auth check
export const users = SEED_USERS;

// Seeding orders
export const orders = [
  new Order({
    id: "ORD-2025-0001",
    buyer_id: "u-buyer",
    buyer_name: "Budi Santoso",
    items: [
      { product_id: "prod-002", product_name: "Selendang Jumputan Sekar Jagad", umkm_name: "Rumah Jumputan Ratu", seller_id: "u-seller-2", qty: 2, price: 285000, image_url: "/src/assets/product-2.jpg" },
    ],
    subtotal: 570000, shipping: 25000, total: 595000,
    status: "Shipped", tracking_number: "JNE-99281736",
    shipping_address: "Jl. Merdeka 12, Palembang",
    payment_method: "Transfer Bank",
    created_at: "2025-05-20T08:30:00Z",
  }),
  new Order({
    id: "ORD-2025-0002",
    buyer_id: "u-buyer",
    buyer_name: "Budi Santoso",
    items: [
      { product_id: "prod-001", product_name: "Songket Lepus Emas Klasik", umkm_name: "Toko Sriwijaya Jaya", seller_id: "u-seller", qty: 1, price: 3850000, image_url: "/src/assets/product-1.jpg" },
    ],
    subtotal: 3850000, shipping: 35000, total: 3885000,
    status: "Processing",
    shipping_address: "Jl. Merdeka 12, Palembang",
    payment_method: "QRIS",
    created_at: "2025-05-25T14:10:00Z",
  }),
  new Order({
    id: "ORD-2025-0003",
    buyer_id: "u-buyer-2",
    buyer_name: "Sari Indah",
    items: [
      { product_id: "prod-005", product_name: "Songket Tabur Bintang Emas", umkm_name: "Toko Sriwijaya Jaya", seller_id: "u-seller", qty: 1, price: 1850000, image_url: "/src/assets/product-5.jpg" },
      { product_id: "prod-010", product_name: "Selendang Jumputan Sogan", umkm_name: "Rumah Jumputan Ratu", seller_id: "u-seller-2", qty: 3, price: 195000, image_url: "/src/assets/product-4.jpg" },
    ],
    subtotal: 2435000, shipping: 30000, total: 2465000,
    status: "Pending",
    shipping_address: "Komp. Bukit Sejahtera B-12, Palembang",
    payment_method: "COD",
    created_at: "2025-05-27T09:45:00Z",
  }),
];

// Seeding certificates
export const certificates = [
  new Certificate({
    id: "CERT-001",
    product_id: "prod-005",
    product_name: "Songket Tabur Bintang Emas",
    seller_id: "u-seller",
    umkm_name: "Toko Sriwijaya Jaya",
    proof_image: "/src/assets/product-5.jpg",
    notes: "Tenunan tangan asli oleh pengrajin Ibu Aminah, menggunakan benang emas import.",
    status: "Pending",
    created_at: "2025-05-22T10:00:00Z",
  }),
  new Certificate({
    id: "CERT-002",
    product_id: "prod-001",
    product_name: "Songket Lepus Emas Klasik",
    seller_id: "u-seller",
    umkm_name: "Toko Sriwijaya Jaya",
    proof_image: "/src/assets/product-1.jpg",
    notes: "Motif Lepus klasik, dikerjakan selama 2 bulan.",
    status: "Approved",
    created_at: "2025-04-15T10:00:00Z",
  }),
];

// Seeding UMKM applications
export const umkmApps = [
  {
    id: "UMKM-101",
    umkm_name: "Tenun Pelangi Sriwijaya",
    owner_name: "Hj. Rohana",
    email: "rohana.tenun@gmail.com",
    phone: "0812-7788-9912",
    city: "Palembang",
    description: "Pengrajin Songket generasi ketiga, fokus motif Lepus dan Tretes Mender.",
    status: "Pending",
    created_at: "2025-05-26T07:00:00Z",
  },
  {
    id: "UMKM-102",
    umkm_name: "Galeri Tenun Musi",
    owner_name: "Bapak Subhan",
    email: "subhan.musi@gmail.com",
    phone: "0813-5566-1122",
    city: "Ogan Ilir",
    description: "Workshop Tajung dan Blongsong dengan 12 pengrajin aktif.",
    status: "Pending",
    created_at: "2025-05-27T11:20:00Z",
  },
  {
    id: "UMKM-103",
    umkm_name: "Songket Cinta Manis",
    owner_name: "Ibu Marlina",
    email: "marlina.cm@gmail.com",
    phone: "0852-2233-4455",
    city: "Prabumulih",
    description: "Spesialis Jumputan dengan pewarna alami.",
    status: "Approved",
    created_at: "2025-04-10T09:00:00Z",
  },
];
