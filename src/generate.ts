import fs from 'fs';
import path from 'path';
import { shopifyAuthenticatedFetch } from './lib/utils';
import {
  collection,
  collection as QueryCollection,
  products as QueryProducts,
} from './lib/handlers';
import type {
  CollectionByIdentifierQuery,
  ProductsQuery,
} from './lib/types/admin.generated';
import type { Discount, DiscountedProductVariant } from './lib/types';
import config from './config';

const collectionVariants: DiscountedProductVariant[] = [];

async function getCollectionProducts(
  discount: Discount,
  handle: string,
  cursor: string | null = null,
) {
  const percent = discount.percentage / 100;
  const response = await shopifyAuthenticatedFetch<CollectionByIdentifierQuery>(
    QueryCollection,
    { handle, cursor },
  );

  const productData = response.data.collectionByIdentifier.products;
  const products = productData.edges;
  const productsPageInfo = productData.pageInfo;
  const { endCursor, hasNextPage } = productsPageInfo;

  products.forEach((product) => {
    const { id, title, productType, vendor, variants } = product.node;

    const isExcludedByBrand = discount.excludedBrands.includes(vendor);

    const isExcludedByProductType =
      discount.excludedProductTypes.includes(productType);

    if (isExcludedByBrand || isExcludedByProductType) {
      return;
    }

    variants.edges.forEach((variant) => {
      const {
        id: variantId,
        sku,
        price,
        compareAtPrice,
        excludedFromDiscounts,
      } = variant.node;

      const isExcludedFromAllDiscounts =
        excludedFromDiscounts && excludedFromDiscounts?.value === 'true';

      if (!isExcludedFromAllDiscounts) {
        collectionVariants.push({
          type: productType,
          brand: vendor,
          productId: id,
          productTitle: title,
          variantId,
          sku,
          price,
          compareAtPrice,
          // round to 2 decimal places
          discountedPrice: Math.round((price - price * percent) * 100) / 100,
          code: discount.code,
        });
      }
    });
  });

  if (hasNextPage) {
    console.log('Fetching next collection page', endCursor);
    await getCollectionProducts(discount, handle, endCursor);
  }
}

async function generateCollectionDiscount(discount: Discount) {
  const { code, collections, percentage } = discount;
  console.log(`Generating collection discount: ${code}`);
  // get products for each collection
  if (collections) {
    for (const collectionHandle of collections) {
      console.log(`Fetching products for collection: ${collectionHandle}`);
      await getCollectionProducts(discount, collectionHandle);
    }
  }
  console.log(`Finished generating collection discount: ${code}`);
}

const productVariants: DiscountedProductVariant[] = [];

async function getProducts(discount: Discount, cursor: string | null = null) {
  const percent = discount.percentage / 100;
  const response = await shopifyAuthenticatedFetch<ProductsQuery>(
    QueryProducts,
    { first: 250, after: cursor },
  );
  const products = response.data.products.edges;
  const pageInfo = response.data.products.pageInfo;

  const { endCursor, hasNextPage } = pageInfo;

  products.forEach((product) => {
    const { id, title, productType, vendor, variants, collections } =
      product.node;
    // check if product belongs to collection and collection discount exists in config
    const hasCollectionDiscount = collections.edges.some((collection) =>
      config.discounts.some(
        (d) =>
          d.appliesTo === 'specific_collections' &&
          d.collections?.includes(collection.node.handle),
      ),
    );

    const isExcludedByBrand = discount.excludedBrands.includes(vendor);

    const isExcludedByProductType =
      discount.excludedProductTypes.includes(productType);

    if (hasCollectionDiscount || isExcludedByBrand || isExcludedByProductType) {
      return;
    }

    variants.edges.forEach((variant) => {
      const {
        id: variantId,
        sku,
        price,
        compareAtPrice,
        excludedFromDiscounts,
      } = variant.node;

      const isExcludedFromAllDiscounts =
        excludedFromDiscounts && excludedFromDiscounts?.value === 'true';

      if (!isExcludedFromAllDiscounts) {
        productVariants.push({
          type: productType,
          brand: vendor,
          productId: id,
          productTitle: title,
          variantId,
          sku,
          price,
          compareAtPrice,
          discountedPrice: Math.round((price - price * percent) * 100) / 100,
          code: discount.code,
        });
      }
    });
  });

  if (hasNextPage) {
    console.log('Fetching next page', endCursor);
    await getProducts(discount, endCursor);
  }
}

async function generateProductDiscount(discount: Discount) {
  const { code } = discount;
  console.log(`Generating product discount: ${code}`);
  // get products
  await getProducts(discount);

  console.log(`Finished generating product discount: ${code}`);
}

async function run() {
  console.log('-----------------------------------------------');
  console.log('Loading Config');
  console.log(JSON.stringify(config, null, 2));
  // find discounts with collections
  const collectionDiscounts = config.discounts.filter(
    (d) => d.appliesTo === 'specific_collections',
  );

  if (collectionDiscounts) {
    console.log('Collection Discounts to generate:', collectionDiscounts);

    const collectionPromises = collectionDiscounts.map((discount) => {
      const { collections } = discount;
      if (collections) {
        return Promise.all(
          collections.map((collectionHandle) => {
            console.log(
              `Fetching products for collection: ${collectionHandle}`,
            );
            return generateCollectionDiscount(discount);
          }),
        );
      }
    });

    await Promise.all(collectionPromises);

    console.log(
      `Finished generating collection discounts`,
      collectionVariants.length,
    );

    if (collectionVariants) {
      // write collectionVariants to file
      fs.writeFileSync(
        path.join(__dirname, '../output/collection-discounts.json'),
        JSON.stringify(collectionVariants, null, 2),
      );
      console.log(
        'Finished writing collection variants to file: output/collection-discounts.json',
      );
    }
  }

  // find discounts with all
  const productDiscounts = config.discounts.filter(
    (d) => d.appliesTo === 'all',
  );

  if (productDiscounts) {
    console.log('Product Discounts to generate:', productDiscounts);

    const productPromises = productDiscounts.map((discount) => {
      return generateProductDiscount(discount);
    });

    await Promise.all(productPromises);

    console.log(
      `Finished generating product discounts`,
      productVariants.length,
    );

    if (productVariants) {
      // write productVariants to file
      fs.writeFileSync(
        path.join(__dirname, '../output/product-discounts.json'),
        JSON.stringify(productVariants, null, 2),
      );
      console.log(
        'Finished writing product variants to file: output/product-discounts.json',
      );
    }
  }
}

run();
