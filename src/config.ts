import type { Config } from './lib/types';

const config: Config = {
  discounts: [
    {
      code: '30% OFF',
      percentage: 30,
      appliesTo: 'all',
      excludedProductTypes: ['Clearance', 'FGWP', 'Insurance'],
      excludedBrands: ['Gunthers', 'Tres Noir'],
    },
    // {
    //   code: 'LABOR_DAY_25_OFF',
    //   percentage: 25,
    //   appliesTo: 'specific_collections',
    //   collections: ['labor-day-sale'],
    //   excludedProductTypes: ['Clearance', 'FGWP', 'Insurance'],
    //   excludedBrands: ['Gunthers', 'Tres Noir'],
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
