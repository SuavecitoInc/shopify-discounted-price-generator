import path from 'path';
import fs from 'fs/promises';

import type { DiscountedProductVariant } from './lib/types';

type SKU = string;

type Discounted = { [key: SKU]: { discountedPrice: number; code: string } };

// Configuration for input and output files
const INPUT_FILES = [
  'output/collection-discounts.json',
  'output/product-discounts.json',
];

const OUTPUT_FILES = {
  discounts: 'output/discounts.json',
  discountsMin: 'output/discounts-min.json',
  skus: 'output/discount-skus.json',
  skusMin: 'output/discount-skus-min.json',
} as const;

// Read and parse a JSON file
async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn(`File not found: ${filePath}`);
      return null;
    }
    console.error(`Error reading ${filePath}:`, error);
    throw error;
  }
}

// Write JSON data to file with optional formatting
async function writeJsonFile(
  filePath: string,
  data: any,
  minify = false,
): Promise<void> {
  const content = minify ? JSON.stringify(data) : JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, content);
}

// Process discount files and create variant mapping
async function processDiscountFiles(): Promise<Discounted> {
  const discountedVariants: Discounted = {};
  let totalVariants = 0;
  let skippedFiles = 0;

  console.log('\n Reading discount files...');

  for (const file of INPUT_FILES) {
    const filePath = path.join(__dirname, '../', file);
    const variants = await readJsonFile<DiscountedProductVariant[]>(filePath);

    if (!variants) {
      skippedFiles++;
      continue;
    }

    console.log(` Processing ${file}: ${variants.length} variants`);

    variants.forEach((item) => {
      const { sku, discountedPrice, code } = item;

      // Warn if SKU is being overwritten
      if (discountedVariants[sku]) {
        console.warn(
          `Duplicate SKU "${sku}" - overwriting with ${code} discount`,
        );
      }

      discountedVariants[sku] = { discountedPrice, code };
      totalVariants++;
    });
  }

  console.log(
    `\n Processed ${totalVariants} total variants from ${INPUT_FILES.length - skippedFiles} files`,
  );
  if (skippedFiles > 0) {
    console.log(`Skipped ${skippedFiles} missing file(s)`);
  }

  return discountedVariants;
}

// Write all output files
async function writeOutputFiles(discountedVariants: Discounted): Promise<void> {
  console.log('\n Writing output files...');

  const skus = Object.keys(discountedVariants);

  // Ensure output directory exists
  const outputDir = path.join(__dirname, '../output');
  await fs.mkdir(outputDir, { recursive: true });

  // Write discount files
  await writeJsonFile(
    path.join(__dirname, '../', OUTPUT_FILES.discounts),
    discountedVariants,
    false,
  );
  console.log(
    `  ✓ ${OUTPUT_FILES.discounts} (${Object.keys(discountedVariants).length} variants)`,
  );

  await writeJsonFile(
    path.join(__dirname, '../', OUTPUT_FILES.discountsMin),
    discountedVariants,
    true,
  );
  console.log(`  ✓ ${OUTPUT_FILES.discountsMin} (minified)`);

  // Write SKU files
  await writeJsonFile(
    path.join(__dirname, '../', OUTPUT_FILES.skus),
    skus,
    false,
  );
  console.log(`  ✓ ${OUTPUT_FILES.skus} (${skus.length} SKUs)`);

  await writeJsonFile(
    path.join(__dirname, '../', OUTPUT_FILES.skusMin),
    skus,
    true,
  );
  console.log(`  ✓ ${OUTPUT_FILES.skusMin} (minified)`);
}

// Generate file size report
async function generateSizeReport(): Promise<void> {
  console.log('\n📏 File sizes:');

  for (const [key, file] of Object.entries(OUTPUT_FILES)) {
    const filePath = path.join(__dirname, '../', file);
    try {
      const stats = await fs.stat(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`  ${file}: ${sizeKB} KB`);
    } catch (error) {
      console.log(`  ${file}: Not found`);
    }
  }
}

// Main execution function
async function run(): Promise<void> {
  try {
    console.log('═══════════════════════════════════════════════');
    console.log('Generating Discounts Payload');
    console.log('═══════════════════════════════════════════════');

    // Process input files
    const discountedVariants = await processDiscountFiles();

    if (Object.keys(discountedVariants).length === 0) {
      console.warn('\n No discounted variants found. Exiting...');
      return;
    }

    // Write output files
    await writeOutputFiles(discountedVariants);

    // Generate size report
    await generateSizeReport();

    // Summary
    console.log('\n═══════════════════════════════════════════════');
    console.log('Payload generation complete!');
    console.log('═══════════════════════════════════════════════');
    console.log(`Summary:`);
    console.log(`   Unique SKUs: ${Object.keys(discountedVariants).length}`);
    console.log(`   Output files: ${Object.keys(OUTPUT_FILES).length}`);
    console.log('═══════════════════════════════════════════════\n');
  } catch (error) {
    console.error('\n Error generating payload:', error);
    process.exit(1);
  }
}

run();
