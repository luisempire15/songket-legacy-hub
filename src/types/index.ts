export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  umkm_name?: string | null;
}

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  umkm_name: string;
  description: string;
  price: number;
  original_price?: number;
  stock: number;
  category: string;
  material: string;
  weight: number;
  image_url: string;
  rating: number;
  total_reviews: number;
  total_sold: number;
  certified: boolean;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  umkm_name: string;
  seller_id: string;
  qty: number;
  price: number;
  image_url: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  buyer_name: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';
  tracking_number?: string | null;
  shipping_address: string;
  payment_method: string;
  created_at: string;
}

export interface Certificate {
  id: string;
  product_id: string;
  product_name: string;
  seller_id: string;
  umkm_name: string;
  proof_image: string;
  notes: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejection_reason?: string | null;
  created_at: string;
}

export interface UmkmApplication {
  id: string;
  umkm_name: string;
  owner_name: string;
  email: string;
  phone: string;
  city: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}
