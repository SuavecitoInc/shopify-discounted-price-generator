# Shopify Discount Pricing Generator

> A tool to generate discounted prices for Shopify products based on a config. This does not create or manage any discounts in Shopify.

This tool can be used to generate discounted prices that can then be used to display the discounted pricing on the storefront via dom manipulation during a sale.

Use case: we create automatic discounts in Shopify and want the prices to display the discounted pricing.

## Setup

```bash
SHOPIFY_ADMIN_API_VERSION=2025-07
SHOPIFY_STORE=suavecito
SHOPIFY_ACCESS_TOKEN=
```

Generate Types

```bash
npm run type-gen
```

Create or Update Config:

The config file is located at `src/config.ts`. Below is an example configuration. Any variant with the metafield `suavecito_function.excluded_from_all_discounts` will be excluded from all discounts regardless of the config.

```typescript
{
  "discounts": [
    {
      "code": "COLLECTIBLES_30_OFF", // discount code
      "percentage": 30,
      "appliesTo": "specific_collections", // specific_collections or all
      "collections": [
        "collectibles"
      ],
      "excludedProductTypes": [
        "Clearance",
        "FGWP",
        "Insurance"
      ],
      "excludedBrands": [
        "Gunthers",
        "Tres Noir"
      ],
    },
    {
      "code": "ALL_20_OFF", // discount code
      "percentage": 20,
      "appliesTo": "all", // specific_collections or all
      "excludedProductTypes": [
        "Clearance",
        "FGWP",
        "Insurance"
      ],
      "excludedBrands": [
        "Gunthers",
        "Tres Noir"
      ],
    }
  ]
}
```

## Run

### Generate discounted prices

```bash
npm run discounts

> shopify-discounted-price-generator@0.0.1 discounts
> tsx src/generate.ts

-----------------------------------------------
Loading Config
{
  "excludedProductTypes": [
    "Clearance",
    "FGWP",
    "Insurance"
  ],
  "excludedBrands": [
    "Gunthers",
    "Tres Noir"
  ],
  "discounts": [
    {
      "code": "COLLECTIBLES_30_OFF",
      "percentage": 30,
      "appliesTo": "specific_collections",
      "collections": [
        "collectibles"
      ]
    },
    {
      "code": "ALL_20_OFF",
      "percentage": 20,
      "appliesTo": "all"
    }
  ]
}
Collection Discounts to generate: [
  {
    code: 'COLLECTIBLES_30_OFF',
    percentage: 30,
    appliesTo: 'specific_collections',
    collections: [ 'collectibles' ]
  }
]
Fetching products for collection: collectibles
Generating collection discount: COLLECTIBLES_30_OFF
Fetching products for collection: collectibles
Fetching next collection page eyJsYXN0X2lkIjo0NDA4ODAzMDMzMTcxLCJsYXN0X3ZhbHVlIjoiNDQwODgwMzAzMzE3MSJ9
Finished generating collection discount: COLLECTIBLES_30_OFF
Finished generating collection discounts 435
Product Discounts to generate: [ { code: 'ALL_20_OFF', percentage: 20, appliesTo: 'all' } ]
Generating product discount: ALL_20_OFF
Fetching next page eyJsYXN0X2lkIjo0OTAyMTQwMjI4LCJsYXN0X3ZhbHVlIjoiNDkwMjE0MDIyOCJ9
Fetching next page eyJsYXN0X2lkIjoxMTczMzk2MjYzOSwibGFzdF92YWx1ZSI6IjExNzMzOTYyNjM5In0=
Fetching next page eyJsYXN0X2lkIjoxMzQ2MDY4OTcxNjAzLCJsYXN0X3ZhbHVlIjoiMTM0NjA2ODk3MTYwMyJ9
Fetching next page eyJsYXN0X2lkIjozOTQ4MjQyNzYzODU5LCJsYXN0X3ZhbHVlIjoiMzk0ODI0Mjc2Mzg1OSJ9
Fetching next page eyJsYXN0X2lkIjo0NDA4ODA1Mjk0MTYzLCJsYXN0X3ZhbHVlIjoiNDQwODgwNTI5NDE2MyJ9
Fetching next page eyJsYXN0X2lkIjo2NTUzNDg0Njg5NDkxLCJsYXN0X3ZhbHVlIjoiNjU1MzQ4NDY4OTQ5MSJ9
Fetching next page eyJsYXN0X2lkIjo2ODE4NjI4NjMyNjU5LCJsYXN0X3ZhbHVlIjoiNjgxODYyODYzMjY1OSJ9
Fetching next page eyJsYXN0X2lkIjo3MTIyNDE1MTI0NTYzLCJsYXN0X3ZhbHVlIjoiNzEyMjQxNTEyNDU2MyJ9
Fetching next page eyJsYXN0X2lkIjo3NTA5MTcxNzk4MDk5LCJsYXN0X3ZhbHVlIjoiNzUwOTE3MTc5ODA5OSJ9
Finished generating product discount: ALL_20_OFF
Finished generating product discounts 6595
```

Example Output:

```json
[
  {
    "type": "Collectibles",
    "brand": "Suavecito",
    "productId": "gid://shopify/Product/170468682",
    "productTitle": "Switchblade Comb",
    "variantId": "gid://shopify/ProductVariant/391335624",
    "sku": "C002BN",
    "price": "7.99",
    "compareAtPrice": null,
    "discountedPrice": 5.59,
    "code": "COLLECTIBLES_30_OFF"
  },
  {
    "type": "Men's Grooming",
    "brand": "Suavecito",
    "productId": "gid://shopify/Product/161353365",
    "productTitle": "Original Hold Pomade",
    "variantId": "gid://shopify/ProductVariant/39685767561299",
    "sku": "P001NN",
    "price": "14.99",
    "compareAtPrice": null,
    "discountedPrice": 11.99,
    "code": "ALL_20_OFF"
  }
]
```

### Generate discounts payload

```bash
npm run payload

> shopify-discounted-price-generator@0.0.1 payload
> tsx src/payload.ts

Discounts payload generated successfully to output/discounts.json.
```

Example Output:

```json
{
  "COLLECTIBLES_30_OFF": [
    { "sku": "C002BN", "discountedPrice": 5.59 },
    { "sku": "M029NN", "discountedPrice": 3.49 }
  ],
  "ALL_20_OFF": [
    { "sku": "P001NN", "discountedPrice": 11.99 },
    { "sku": "P009NN", "discountedPrice": 32.79 }
  ]
}
```
