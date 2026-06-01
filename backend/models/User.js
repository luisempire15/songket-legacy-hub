export class User {
  constructor({ id, full_name, email, role, umkm_name }) {
    this.id = id;
    this.full_name = full_name;
    this.email = email;
    this.role = role; // buyer, seller, admin
    this.umkm_name = umkm_name;
  }
}
