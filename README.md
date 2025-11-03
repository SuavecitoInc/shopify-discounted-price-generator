# Shopify Discount Swap Pricing Generator

> A tool to generate discounted prices for Shopify products based on configuration. This does not create or manage discounts in Shopify itself.

## Table of Contents

- [Why This Tool Exists](#why-this-tool-exists)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

## Why This Tool Exists

Discounts created by our Functions app lack settings for collections, products, or variants. When querying a discount node created by the Functions app, it won't return the collections, products, or variants the discount applies to.

The Functions app uses a JSON config saved to a discount metafield to determine applicable line item discounts at runtime. This tool generates the discounted prices for products and variants based on a similar config, allowing us to display accurate discounted prices on the storefront.

## Prerequisites

- Node.js 18+
- npm or yarn
- Shopify Admin API access token with appropriate permissions

## Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Create environment file:**

Create a `.env` file in the project root:

```bash
SHOPIFY_ADMIN_API_VERSION=2025-07
SHOPIFY_STORE=suavecito
SHOPIFY_ACCESS_TOKEN=your_access_token_here
```

3. **Generate types:**

```bash
npm run type-gen
```

## Configuration

The config file is located at `src/config.ts`.

### Configuration Schema

- `discounts`: Array of discount configurations
  - `code`: Unique discount code identifier
  - `percentage`: Discount percentage (0-100)
  - `appliesTo`: Either `"specific_collections"` or `"all"`
  - `collections`: (Optional) Array of collection handles when using `specific_collections`
  - `excludedProductTypes`: (Optional) Array of product types to exclude
  - `excludedBrands`: (Optional) Array of brand names to exclude

### Important Notes

- Any variant with the metafield `suavecito_function.excluded_from_all_discounts` will be excluded from **all** discounts regardless of the config
- Discount codes should be unique across all configurations
- Percentage values should be whole numbers (e.g., 30 for 30%)

### Example Configuration

```typescript
const config: Config = {
  discounts: [
    {
      code: '30% OFF',
      percentage: 30,
      appliesTo: 'all',
      excludedProductTypes: ['Clearance', 'FGWP', 'Insurance'],
      excludedBrands: ['Tres Noir'],
    },
    // {
    //   code: 'LABOR_DAY_25_OFF',
    //   percentage: 25,
    //   appliesTo: 'specific_collections',
    //   collections: ['labor-day-sale'],
    //   excludedProductTypes: ['Clearance', 'FGWP', 'Insurance'],
    //   excludedBrands: ['Tres Noir'],
    // }
  ],
};
```

## Usage

### Generate Discounted Prices

Generates a detailed list of all discounted prices based on your configuration:

```bash
npm run discounts

═══════════════════════════════════════════════
Starting Discount Generation
═══════════════════════════════════════════════

Configuration:
{
  "discounts": [
    {
      "code": "30% OFF",
      "percentage": 30,
      "appliesTo": "all",
      "excludedProductTypes": [
        "Clearance",
        "FGWP",
        "Insurance"
      ],
      "excludedBrands": [
        "Tres Noir"
      ]
    }
  ]
}

No collection discounts to process

Processing 1 product discount(s)...

Generating product discount: 30% OFF
Fetching next page... (cursor: eyJsYXN0X2lkIjo0OTAyMTQwMjI4LCJsYXN0X3ZhbHVlIjoiNDkwMjE0MDIyOCJ9)
Fetching next page... (cursor: eyJsYXN0X2lkIjoxMTczMzk2MjYzOSwibGFzdF92YWx1ZSI6IjExNzMzOTYyNjM5In0=)
Fetching next page... (cursor: eyJsYXN0X2lkIjoxMzQ2MDY4OTcxNjAzLCJsYXN0X3ZhbHVlIjoiMTM0NjA2ODk3MTYwMyJ9)
Fetching next page... (cursor: eyJsYXN0X2lkIjozOTQ4MjQyNzYzODU5LCJsYXN0X3ZhbHVlIjoiMzk0ODI0Mjc2Mzg1OSJ9)
Fetching next page... (cursor: eyJsYXN0X2lkIjo0NDA4ODA1Mjk0MTYzLCJsYXN0X3ZhbHVlIjoiNDQwODgwNTI5NDE2MyJ9)
Fetching next page... (cursor: eyJsYXN0X2lkIjo2NTUzNDg0Njg5NDkxLCJsYXN0X3ZhbHVlIjoiNjU1MzQ4NDY4OTQ5MSJ9)
Fetching next page... (cursor: eyJsYXN0X2lkIjo2ODE4NjI4NjMyNjU5LCJsYXN0X3ZhbHVlIjoiNjgxODYyODYzMjY1OSJ9)
Fetching next page... (cursor: eyJsYXN0X2lkIjo3MTIyNDE1MTI0NTYzLCJsYXN0X3ZhbHVlIjoiNzEyMjQxNTEyNDU2MyJ9)
Fetching next page... (cursor: eyJsYXN0X2lkIjo3NTA5MTcxNzk4MDk5LCJsYXN0X3ZhbHVlIjoiNzUwOTE3MTc5ODA5OSJ9)
Completed product discount: 30% OFF

Wrote 6506 items to product-discounts.json
  Store-wide discounted variants

═══════════════════════════════════════════════
Discount generation complete!
═══════════════════════════════════════════════
Summary:
   Collection variants: 0
   Product variants: 6506
   Total variants: 6506
═══════════════════════════════════════════════
```

**Output:** `output/discounted-prices.json`

### Generate Discounts Payload

Generates a simplified SKU-to-discount mapping for frontend consumption:

```bash
npm run payload

═══════════════════════════════════════════════
Generating Discounts Payload
═══════════════════════════════════════════════

Reading discount files...
Processing output/collection-discounts.json: 0 variants
Processing output/product-discounts.json: 6506 variants
Duplicate SKU "M690NN" - overwriting with 30% OFF discount
Duplicate SKU "M799NN" - overwriting with 30% OFF discount
Duplicate SKU "M798NN" - overwriting with 30% OFF discount
Duplicate SKU "M926NN" - overwriting with 30% OFF discount
Duplicate SKU "C163NN" - overwriting with 30% OFF discount

Processed 6506 total variants from 2 files

Writing output files...
output/discounts.json (6501 variants)
output/discounts-min.json (minified)
output/discount-skus.json (6501 SKUs)
output/discount-skus-min.json (minified)

File sizes:
  output/discounts.json: 453.21 KB
  output/discounts-min.json: 332.59 KB
  output/discount-skus.json: 82.87 KB
  output/discount-skus-min.json: 63.82 KB

═══════════════════════════════════════════════
Payload generation complete!
═══════════════════════════════════════════════
Summary:
   Unique SKUs: 6501
   Output files: 4
═══════════════════════════════════════════════
```

**Output:** `output/discounts.json`

## Troubleshooting

### Common Issues

**Rate Limiting:**
If you encounter rate limiting errors, the script will automatically retry with exponential backoff.

**Missing Environment Variables:**
Ensure all required environment variables are set in your `.env` file.

**Type Generation Failures:**
Run `npm run type-gen` after any Shopify API version updates.

### Support

For issues or questions, contact the development team.
