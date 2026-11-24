import type { Config } from './lib/types';

const config: Config = {
  discounts: [
    // {
    //   code: 'SALE',
    //   percentage: 20,
    //   appliesTo: 'all',
    //   excludedProductTypes: ['Clearance', 'FGWP', 'Insurance'],
    //   excludedBrands: ['Gunthers'],
    // },
    // {
    //   code: 'TN 40% OFF',
    //   percentage: 40,
    //   appliesTo: 'specific_collections',
    //   collections: ['tres-noir'],
    //   excludedProductTypes: ['Clearance', 'FGWP', 'Insurance'],
    //   excludedBrands: ['Gunthers'],
    // },
    // {
    //   code: 'COLLECTIBLES_30_OFF',
    //   percentage: 30,
    //   appliesTo: 'specific_collections',
    //   collections: ['collectibles'],
    //   excludedProductTypes: ['Clearance', 'FGWP', 'Insurance'],
    //   excludedBrands: ['Gunthers', 'Tres Noir'],
    // },
    // {
    //   code: 'ALL_20_OFF',
    //   percentage: 20,
    //   appliesTo: 'all',
    //   excludedProductTypes: ['Clearance', 'FGWP', 'Insurance'],
    //   excludedBrands: ['Gunthers', 'Tres Noir'],
    // },
    // BF / CM 2026
    {
      code: 'BUY 2 GET 1 FREE',
      percentage: 0,
      appliesTo: 'specific_collections',
      collections: ['grooming-and-beauty-products-test'],
      excludedProductTypes: ['Clearance', 'FGWP', 'Insurance'],
      excludedBrands: ['Gunthers', 'Tres Noir'],
    },
    {
      code: '20% OFF Merch',
      percentage: 20,
      appliesTo: 'specific_collections',
      collections: ['collectibles-test'],
      excludedProductTypes: ['Clearance', 'FGWP', 'Insurance'],
      excludedBrands: ['Gunthers', 'Tres Noir'],
    },
    {
      code: '20% OFF Apparel',
      percentage: 20,
      appliesTo: 'specific_collections',
      collections: ['apparel-test'],
      excludedProductTypes: ['Clearance', 'FGWP', 'Insurance'],
      excludedBrands: ['Gunthers', 'Tres Noir'],
    },
  ],
};

export default config;
