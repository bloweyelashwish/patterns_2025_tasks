'use strict';

class Basket {
  total = 0;
  errors = [];

  constructor(config = {}, callback) {
    this.limit = config.limit || Infinity;
    this.callback = callback;
    this.items = [];
  }

  limitReached(nextItemPrice) {
    return this.total + nextItemPrice > this.limit;
  }

  add(item) {
    if (this.limitReached(item.price)) {
      this.errors.push(`Item "${item.name}" exceeds basket limit`);
    } else {
      this.items.push(item);
      this.total += item.price;
    }

    return this;
  }

  end() {
    return new Promise((resolve) => {
      const result = {
        items: this.items,
        total: this.total,
        aggregatedErrors: new AggregateError(this.errors),
      };

      if (this.callback) {
        this.callback(this.items, this.total);
      }

      resolve(result);
    });
  }
}

module.exports = Basket;
