export class Product {
  constructor({
    id,
    seller_id,
    name,
    umkm_name,
    description,
    price,
    original_price,
    stock,
    category,
    material,
    weight,
    image_url,
    rating,
    total_reviews,
    total_sold,
    certified
  }) {
    this.id = id;
    this.seller_id = seller_id;
    this.name = name;
    this.umkm_name = umkm_name;
    this.description = description;
    this.price = Number(price);
    this.original_price = original_price ? Number(original_price) : undefined;
    this.stock = Number(stock);
    this.category = category;
    this.material = material;
    this.weight = Number(weight);
    this.image_url = image_url;
    this.rating = rating !== undefined ? Number(rating) : 0;
    this.total_reviews = total_reviews !== undefined ? Number(total_reviews) : 0;
    this.total_sold = total_sold !== undefined ? Number(total_sold) : 0;
    this.certified = certified || false;
  }
}
