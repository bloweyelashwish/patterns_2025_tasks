'use strict';

const PurchaseIterator = require('./purchase');
const Basket = require('./basket');

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

  const basket = new Basket({ limit: 2500 }, (items, total) => {
    console.log({
      total,
      items,
    });
  });

  for await (const item of goods) {
    basket.add(item);
  }

  const result = await basket.end();

  console.log('Items in basket:', result.items.length);
  console.log('Total cost:', result.total);
  console.log('Errors:', result.aggregatedErrors.errors);

  return result;
};

main();
