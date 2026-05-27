import type { Config } from './lib/types';

const config: Config = {
  discounts: [
    {
      code: 'MEMORIAL26',
      percentage: 20,
      appliesTo: 'all',
      excludedProductTypes: ['Clearance', 'FGWP', 'Insurance'],
      excludedBrands: ['Gunthers', 'Tres Noir'],
    },
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
  ],
};

export default config;
