import { PaymentStrategy } from "./PaymentStrategy.js";

export class CodPayment extends PaymentStrategy {
  processPayment(amount, orderDetails) {
    return {
      success: true,
      status: "Processing", // Will be paid on delivery (processing first)
      payment_method: "COD",
      details: {
        instructions: `Prepare Rp ${amount.toLocaleString("id-ID")} in cash to be paid to the courier upon delivery.`
      }
    };
  }
}
