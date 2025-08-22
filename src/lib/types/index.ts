export type Discount = {
  code: string;
  percentage: number;
  appliesTo: 'all' | 'specific_collections' | 'specific_product_types';
  collections?: string[];
  excludedProductTypes: string[];
  excludedBrands: string[];
};

export type Config = { discounts: Discount[] };

export type DiscountedProductVariant = {
  type: string;
  brand: string;
  productId: string;
  productTitle: string;
  variantId: string;
  sku: string;
  price: number;
  compareAtPrice: number;
  discountedPrice: number;
  code: string;
};
