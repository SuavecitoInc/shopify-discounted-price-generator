import fs from 'fs/promises';
import path from 'path';
import { shopifyAuthenticatedFetch } from './lib/utils';
import {
  collection as QueryCollection,
  products as QueryProducts,
} from './lib/handlers';
import type {
  CollectionByIdentifierQuery,
  ProductsQuery,
} from './lib/types/admin.generated';
import type { Discount, DiscountedProductVariant } from './lib/types';
import config from './config';

// Storage for discounted variants
const collectionVariants: DiscountedProductVariant[] = [];
const productVariants: DiscountedProductVariant[] = [];

// Retry wrapper for API calls with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    console.warn(`Retry attempt remaining: ${retries}. Waiting ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

// Calculate discounted price with 2 decimal places
function calculateDiscountedPrice(price: number, percentage: number): number {
  const percent = percentage / 100;
  return Math.round((price - price * percent) * 100) / 100;
}

// Check if product is excluded based on brand or product type
function isProductExcluded(
  vendor: string,
  productType: string,
  discount: Discount,
): boolean {
  return (
    discount.excludedBrands.includes(vendor) ||
    discount.excludedProductTypes.includes(productType)
  );
}

// Check if variant is excluded from all discounts via metafield
function isVariantExcluded(excludedFromDiscounts: any): boolean {
  return excludedFromDiscounts?.value === 'true';
}

// Create a discounted variant object
function createDiscountedVariant(
  product: { id: string; title: string; productType: string; vendor: string },
  variant: any,
  discount: Discount,
): DiscountedProductVariant {
  return {
    type: product.productType,
    brand: product.vendor,
    productId: product.id,
    productTitle: product.title,
    variantId: variant.id,
    sku: variant.sku,
    price: variant.price,
    compareAtPrice: variant.compareAtPrice,
    discountedPrice: calculateDiscountedPrice(
      variant.price,
      discount.percentage,
    ),
    code: discount.code,
  };
}

// Fetch and process products from a specific collection
async function getCollectionProducts(
  discount: Discount,
  handle: string,
  cursor: string | null = null,
): Promise<void> {
  try {
    const response = await withRetry(() =>
      shopifyAuthenticatedFetch<CollectionByIdentifierQuery>(QueryCollection, {
        handle,
        cursor,
      }),
    );

    if (!response.data?.collectionByIdentifier) {
      console.warn(`Collection not found: ${handle}`);
      return;
    }

    const productData = response.data.collectionByIdentifier.products;
    const products = productData.edges;

    products.forEach((product) => {
      const { id, title, productType, vendor, variants } = product.node;

      if (isProductExcluded(vendor, productType, discount)) {
        return;
      }

      variants.edges.forEach((variant) => {
        if (isVariantExcluded(variant.node.excludedFromDiscounts)) {
          return;
        }

        collectionVariants.push(
          createDiscountedVariant(
            { id, title, productType, vendor },
            variant.node,
            discount,
          ),
        );
      });
    });

    if (productData.pageInfo.hasNextPage) {
      console.log(
        `Fetching next page... (cursor: ${productData.pageInfo.endCursor})`,
      );
      await getCollectionProducts(
        discount,
        handle,
        productData.pageInfo.endCursor,
      );
    }
  } catch (error) {
    console.error(`Error processing collection ${handle}:`, error);
    throw error;
  }
}

// Generate discounts for a specific collection
async function generateCollectionDiscount(discount: Discount): Promise<void> {
  const { code, collections } = discount;
  console.log(`\nGenerating collection discount: ${code}`);

  if (!collections || collections.length === 0) {
    console.warn(`No collections specified for discount: ${code}`);
    return;
  }

  for (const collectionHandle of collections) {
    console.log(`Processing collection: ${collectionHandle}`);
    await getCollectionProducts(discount, collectionHandle);
  }

  console.log(`Completed collection discount: ${code}`);
}

// Fetch and process all products (with exclusions)
async function getProducts(
  discount: Discount,
  cursor: string | null = null,
): Promise<void> {
  try {
    const response = await withRetry(() =>
      shopifyAuthenticatedFetch<ProductsQuery>(QueryProducts, {
        first: 250,
        after: cursor,
      }),
    );

    const products = response.data.products.edges;
    const pageInfo = response.data.products.pageInfo;

    products.forEach((product) => {
      const { id, title, productType, vendor, variants, collections } =
        product.node;

      // Skip if product belongs to a collection with a specific discount
      const hasCollectionDiscount = collections.edges.some((collection) =>
        config.discounts.some(
          (d) =>
            d.appliesTo === 'specific_collections' &&
            d.collections?.includes(collection.node.handle),
        ),
      );

      if (
        hasCollectionDiscount ||
        isProductExcluded(vendor, productType, discount)
      ) {
        return;
      }

      variants.edges.forEach((variant) => {
        if (isVariantExcluded(variant.node.excludedFromDiscounts)) {
          return;
        }

        productVariants.push(
          createDiscountedVariant(
            { id, title, productType, vendor },
            variant.node,
            discount,
          ),
        );
      });
    });

    if (pageInfo.hasNextPage) {
      console.log(`Fetching next page... (cursor: ${pageInfo.endCursor})`);
      await getProducts(discount, pageInfo.endCursor);
    }
  } catch (error) {
    console.error(`Error fetching products:`, error);
    throw error;
  }
}

// Generate store-wide product discounts
async function generateProductDiscount(discount: Discount): Promise<void> {
  const { code } = discount;
  console.log(`\nGenerating product discount: ${code}`);
  await getProducts(discount);
  console.log(`Completed product discount: ${code}`);
}

// Ensure output directory exists
async function ensureOutputDirectory(): Promise<void> {
  const outputDir = path.join(__dirname, '../output');
  await fs.mkdir(outputDir, { recursive: true });
}

// Write JSON data to file
async function writeJsonFile(
  filename: string,
  data: any[],
  description: string,
): Promise<void> {
  const filePath = path.join(__dirname, '../output', filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`\nWrote ${data.length} items to ${filename}`);
  console.log(`  ${description}`);
}

// Main execution function
async function run(): Promise<void> {
  try {
    console.log('═══════════════════════════════════════════════');
    console.log('Starting Discount Generation');
    console.log('═══════════════════════════════════════════════');
    console.log('\nConfiguration:');
    console.log(JSON.stringify(config, null, 2));

    await ensureOutputDirectory();

    // Process collection-specific discounts
    const collectionDiscounts = config.discounts.filter(
      (d) => d.appliesTo === 'specific_collections',
    );

    if (collectionDiscounts.length > 0) {
      console.log(
        `\nProcessing ${collectionDiscounts.length} collection discount(s)...`,
      );

      for (const discount of collectionDiscounts) {
        await generateCollectionDiscount(discount);
      }

      await writeJsonFile(
        'collection-discounts.json',
        collectionVariants,
        'Collection-specific discounted variants',
      );
    } else {
      console.log('\nNo collection discounts to process');
    }

    // Process store-wide product discounts
    const productDiscounts = config.discounts.filter(
      (d) => d.appliesTo === 'all',
    );

    if (productDiscounts.length > 0) {
      console.log(
        `\nProcessing ${productDiscounts.length} product discount(s)...`,
      );

      for (const discount of productDiscounts) {
        await generateProductDiscount(discount);
      }

      await writeJsonFile(
        'product-discounts.json',
        productVariants,
        'Store-wide discounted variants',
      );
    } else {
      console.log('\nNo product discounts to process');
    }

    // Summary
    console.log('\n═══════════════════════════════════════════════');
    console.log('Discount generation complete!');
    console.log('═══════════════════════════════════════════════');
    console.log(`Summary:`);
    console.log(`   Collection variants: ${collectionVariants.length}`);
    console.log(`   Product variants: ${productVariants.length}`);
    console.log(
      `   Total variants: ${collectionVariants.length + productVariants.length}`,
    );
    console.log('═══════════════════════════════════════════════\n');
  } catch (error) {
    console.error('\nError generating discounts:', error);
    process.exit(1);
  }
}

run();
