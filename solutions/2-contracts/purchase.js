'use strict';

class PurchaseIterator {
  constructor(purchase) {
    this.purchase = purchase;
  }

  static create(purchase) {
    return new PurchaseIterator(purchase);
  }

  [Symbol.asyncIterator]() {
    const purchase = this.purchase;
    let index = 0;

    return {
      async next() {
        if (index < purchase.length) {
          return { value: purchase[index++], done: false };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  }
}

module.exports = PurchaseIterator;
