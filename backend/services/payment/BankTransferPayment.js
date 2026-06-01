import { PaymentStrategy } from "./PaymentStrategy.js";

export class BankTransferPayment extends PaymentStrategy {
  processPayment(amount, orderDetails) {
    // Bank transfer details
    const vaNumber = `8806${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    return {
      success: true,
      status: "Pending", // Awaiting bank transfer validation
      payment_method: "Transfer Bank",
      details: {
        bank: orderDetails.bank || "Mandiri",
        virtual_account: vaNumber,
        instructions: `Transfer exactly Rp ${amount.toLocaleString("id-ID")} to ${orderDetails.bank || "Mandiri"} Virtual Account ${vaNumber}.`
      }
    };
  }
}
