const Product = require('../models/Product');
const Category = require('../models/Category');

// Standard luxury brand prefix for Dazzling Sky
const BRAND_PREFIX = 'DZ';

// Predefined mnemonic codes for core floral collections
const DEFAULT_CATEGORY_CODES = {
  'bouquets': 'BQ',
  'vases': 'VS',
  'wedding': 'WD',
  'gifts': 'GF',
  'seasonal limited': 'SL',
  'seasonal': 'SL',
  'private reserve': 'PR',
  'signature collection': 'SC',
  'signature': 'SC',
  'anniversary': 'AN',
  'romantic': 'RM',
  'romance': 'RM',
  'orchids': 'OR',
  'roses': 'RS',
  'tulips': 'TL',
  'lilies': 'LL',
  'sympathy': 'SY',
  'celebration': 'CL'
};

/**
 * Derives a 2-3 letter uppercase category code from a category name.
 * e.g. "Seasonal Limited" -> "SL"
 *      "Bridal Bouquets" -> "BB"
 *      "Orchids" -> "OR"
 */
function deriveCategoryCode(name) {
  if (!name || typeof name !== 'string') return 'GEN';
  const clean = name.trim();
  const lower = clean.toLowerCase();

  // Check known defaults
  if (DEFAULT_CATEGORY_CODES[lower]) {
    return DEFAULT_CATEGORY_CODES[lower];
  }

  // Multi-word name: take the first letter of each word (up to 3 letters)
  const words = clean.split(/[\s-_]+/).filter(Boolean);
  if (words.length >= 2) {
    return words.slice(0, 3).map(w => w[0]).join('').toUpperCase();
  }

  // Single word: use first letter + consonants or up to 3 letters
  const word = words[0].toUpperCase();
  if (word.length <= 3) return word;

  const consonants = word.slice(1).replace(/[AEIOU]/g, '');
  if (consonants.length >= 1) {
    return (word[0] + consonants.slice(0, 2)).toUpperCase();
  }

  return word.slice(0, 2).toUpperCase();
}

/**
 * Resolves the category code for a category name by checking the database first,
 * then falling back to algorithmic derivation.
 */
async function resolveCategoryCode(categoryName) {
  if (!categoryName) return 'BQ';
  const clean = categoryName.trim();

  // Check if category is saved with a custom code
  try {
    const cat = await Category.findOne({
      name: new RegExp(`^${clean}$`, 'i')
    }).select('code name').lean();

    if (cat && cat.code && cat.code.trim()) {
      return cat.code.trim().toUpperCase();
    }
  } catch (err) {
    console.error('Error looking up category code:', err);
  }

  return deriveCategoryCode(clean);
}

/**
 * Generates the next sequential unique SKU for a given category.
 * Format: DZ-[CATEGORY_CODE]-[01, 02, ...]
 * e.g. DZ-SL-01, DZ-SL-02, DZ-WD-01
 */
async function generateNextProductSku(categoryName, customCode = null) {
  const catCode = customCode ? customCode.trim().toUpperCase() : await resolveCategoryCode(categoryName);
  const prefix = `${BRAND_PREFIX}-${catCode}-`;

  // Query all existing SKUs matching this prefix
  const existingProducts = await Product.find({
    sku: new RegExp(`^${prefix}\\d+`, 'i')
  }).select('sku').lean();

  let maxNum = 0;
  existingProducts.forEach(p => {
    if (p.sku) {
      const match = p.sku.match(new RegExp(`^${prefix}(\\d+)`, 'i'));
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  });

  let nextSequence = maxNum + 1;
  let candidate = `${prefix}${nextSequence.toString().padStart(2, '0')}`;

  // Collision-safety: ensure no existing product shares this candidate
  while (await Product.findOne({ sku: candidate }).select('_id').lean()) {
    nextSequence++;
    candidate = `${prefix}${nextSequence.toString().padStart(2, '0')}`;
  }

  return {
    sku: candidate,
    brandCode: BRAND_PREFIX,
    categoryCode: catCode,
    sequenceNumber: nextSequence.toString().padStart(2, '0'),
    category: categoryName || 'General',
    breakdown: `${BRAND_PREFIX} (Dazzling Sky) - ${catCode} (${categoryName || 'General'}) - ${nextSequence.toString().padStart(2, '0')}`
  };
}

module.exports = {
  BRAND_PREFIX,
  deriveCategoryCode,
  resolveCategoryCode,
  generateNextProductSku
};
