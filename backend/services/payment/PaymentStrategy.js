export class PaymentStrategy {
  /**
   * Abstract method to process payment
   * @param {number} amount 
   * @param {object} orderDetails 
   * @returns {object} status and details of transaction
   */
  processPayment(amount, orderDetails) {
    throw new Error("Method 'processPayment(amount, orderDetails)' must be implemented.");
  }
}
