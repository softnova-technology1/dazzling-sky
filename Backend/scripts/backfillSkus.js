require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { deriveCategoryCode } = require('../utils/skuGenerator');

async function backfill() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is missing in environment!');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected.');

  // 1. Backfill Categories with SKU Codes
  const categories = await Category.find();
  console.log(`Found ${categories.length} categories.`);
  for (const cat of categories) {
    if (!cat.code) {
      const code = deriveCategoryCode(cat.name);
      cat.code = code;
      await cat.save();
      console.log(`Updated Category "${cat.name}" -> Code: ${code}`);
    }
  }

  // 2. Backfill Products with SKUs
  const products = await Product.find().sort({ createdAt: 1 });
  console.log(`Found ${products.length} products to check for SKUs.`);
  
  const categoryCounters = {};

  for (const prod of products) {
    const catName = prod.category || 'Bouquets';
    const cat = await Category.findOne({ name: new RegExp(`^${catName.trim()}$`, 'i') });
    const code = (cat && cat.code) ? cat.code : deriveCategoryCode(catName);

    if (!categoryCounters[code]) {
      categoryCounters[code] = 0;
    }

    if (!prod.sku) {
      categoryCounters[code] += 1;
      const sku = `DZ-${code}-${categoryCounters[code].toString().padStart(2, '0')}`;
      prod.sku = sku;
      await prod.save();
      console.log(`Assigned SKU to "${prod.name}" (${catName}) -> ${sku}`);
    } else {
      // Record highest number if exists
      const match = prod.sku.match(new RegExp(`^DZ-${code}-(\\d+)`, 'i'));
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > categoryCounters[code]) {
          categoryCounters[code] = num;
        }
      }
    }
  }

  console.log('✅ SKU Backfill completed successfully!');
  await mongoose.disconnect();
  process.exit(0);
}

backfill().catch(err => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
