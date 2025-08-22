import path from 'path';
import fs from 'fs';

import type { DiscountedProductVariant } from './lib/types';

const files = [
  'output/collection-discounts.json',
  'output/product-discounts.json',
];

const discountObject = {};

function run() {
  files.forEach((file) => {
    const filePath = path.join(__dirname, '../', file);
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(data);

      jsonData.forEach((item: DiscountedProductVariant) => {
        const key = item.code;
        if (!discountObject[key]) {
          discountObject[key] = [];
        }
        discountObject[key].push({
          sku: item.sku,
          discountedPrice: item.discountedPrice,
        });
      });
    } catch (error) {
      console.error(`Error reading ${file}:`, error);
    }
  });

  // write discount object to new file
  fs.writeFileSync(
    path.join(__dirname, '../output/discounts.json'),
    JSON.stringify(discountObject, null, 2),
  );

  console.log(
    'Discounts payload generated successfully to output/discounts.json.',
  );
}

run();
