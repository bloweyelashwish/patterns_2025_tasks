'use strict';

// Create Iterator for given dataset with Symbol.asyncIterator
class PurchaseIterator {
  constructor(purchase) {
    this.purchase = purchase || [];
  }

  // Static factory method
  static create(purchase) {
    return new PurchaseIterator(purchase);
  }

  // Proper async iterator implementation
  [Symbol.asyncIterator]() {
    const purchase = this.purchase;
    let index = 0;

    return {
      async next() {
        if (index < purchase.length) {
          return { value: purchase[index++], done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
}

// Basket class with limit and thenable support
class Basket {
  constructor(options = {}, callback) {
    this.limit = options.limit || Infinity;
    this.callback = callback;
    this.items = [];
    this.total = 0;
    this.errors = [];
  }

  // Make add() async to match the hint "call async function without await"
  async add(item) {
    try {
      if (this.total + item.price <= this.limit) {
        this.items.push(item);
        this.total += item.price;
        console.log(`Added: ${item.name} - ${item.price} (Total: ${this.total})`);
      } else {
        this.errors.push(`Item "${item.name}" exceeds basket limit. Current: ${this.total}, Item price: ${item.price}, Limit: ${this.limit}`);
        console.log(`Rejected: ${item.name} - exceeds limit`);
      }
    } catch (error) {
      this.errors.push(`Error adding item "${item.name}": ${error.message}`);
    }
  }

  // Returns a thenable (Promise-like object)
  end() {
    return {
      then: (resolve, reject) => {
        try {
          const result = {
            items: this.items,
            total: this.total,
            errors: this.errors
          };

          // Call the callback if provided
          if (this.callback) {
            this.callback(this.items, this.total);
          }

          resolve(result);
        } catch (error) {
          reject(error);
        }
      }
    };
  }
}

const purchase = [
  { name: 'Laptop', price: 1500 },
  { name: 'Mouse', price: 25 },
  { name: 'Keyboard', price: 100 },
  { name: 'HDMI cable', price: 10 },
  { name: 'Bag', price: 50 },
  { name: 'Mouse pad', price: 5 },
];

const main = async () => {
  const goods = PurchaseIterator.create(purchase);
  const basket = new Basket({ limit: 1050 }, (items, total) => {
    console.log('Callback - Total:', total);
    console.log('Callback - Items count:', items.length);
  });

  // Hint: call async function without await
  for await (const item of goods) {
    basket.add(item); // Called without await, as per hint
  }

  // Hint: Add basket.end();
  basket.end().then(result => {
    console.log('\n--- Final Result ---');
    console.log('Items in basket:', result.items.length);
    console.log('Total cost:', result.total);
    console.log('Errors:', result.errors.length > 0 ? result.errors : 'None');
  });
};

// Run the main function
main().catch(console.error);