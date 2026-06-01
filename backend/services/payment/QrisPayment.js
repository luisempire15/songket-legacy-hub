import { PaymentStrategy } from "./PaymentStrategy.js";

export class QrisPayment extends PaymentStrategy {
  processPayment(amount, orderDetails) {
    // Generate a mock QR code link or image
    return {
      success: true,
      status: "Pending", // QRIS starts as pending/waiting payment
      payment_method: "QRIS",
      details: {
        qr_code_url: "/src/assets/qris-placeholder.png", // QR Code mockup image
        instructions: `Scan this QRIS code using your e-wallet (GoPay, OVO, Dana, LinkAja) to pay Rp ${amount.toLocaleString("id-ID")}.`
      }
    };
  }
}
