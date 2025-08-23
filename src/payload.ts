import path from 'path';
import fs from 'fs';

import type { DiscountedProductVariant } from './lib/types';

type SKU = string;

type Discounted = { [key: SKU]: { discountedPrice: number; code: string } };

const files = [
  'output/collection-discounts.json',
  'output/product-discounts.json',
];

const discountedVariants: Discounted = {};

function run() {
  files.forEach((file) => {
    const filePath = path.join(__dirname, '../', file);
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(data);

      jsonData.forEach((item: DiscountedProductVariant) => {
        const { sku, discountedPrice, code } = item;
        discountedVariants[sku] = { discountedPrice, code };
      });
    } catch (error) {
      console.error(`Error reading ${file}:`, error);
    }
  });

  // write discount object to new file
  fs.writeFileSync(
    path.join(__dirname, '../output/discounts.json'),
    JSON.stringify(discountedVariants, null, 2),
  );

  fs.writeFileSync(
    path.join(__dirname, '../output/discounts-min.json'),
    JSON.stringify(discountedVariants),
  );

  console.log(
    'Discounts payload generated successfully to output/discounts.json.',
  );
}

run();
