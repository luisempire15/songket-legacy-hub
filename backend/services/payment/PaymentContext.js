import { BankTransferPayment } from "./BankTransferPayment.js";
import { QrisPayment } from "./QrisPayment.js";
import { CodPayment } from "./CodPayment.js";

export class PaymentContext {
  constructor() {
    this.strategies = {};
    // Register default payment strategies
    this.registerStrategy("Transfer Bank", new BankTransferPayment());
    this.registerStrategy("QRIS", new QrisPayment());
    this.registerStrategy("COD", new CodPayment());
  }

  registerStrategy(method, strategy) {
    this.strategies[method] = strategy;
  }

  executeStrategy(method, amount, orderDetails) {
    const strategy = this.strategies[method];
    if (!strategy) {
      throw new Error(`Unsupported payment method: '${method}'`);
    }
    return strategy.processPayment(amount, orderDetails);
  }
}
