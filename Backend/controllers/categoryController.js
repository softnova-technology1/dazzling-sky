const Category = require('../models/Category');
const Product = require('../models/Product');
const { deriveCategoryCode } = require('../utils/skuGenerator');

// Get all categories with product counts
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    
    // Enrich with live product count and ensured SKU code
    const enriched = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({
          $or: [
            { category: new RegExp(`^${cat.name}$`, 'i') },
            { collectionName: new RegExp(`^${cat.name}$`, 'i') }
          ]
        });
        const code = cat.code || deriveCategoryCode(cat.name);
        return {
          ...cat.toObject(),
          code,
          itemCount: count
        };
      })
    );

    res.status(200).json(enriched);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Create a new category / collection
exports.createCategory = async (req, res) => {
  try {
    const { name, code, description, bannerImage: bodyBanner } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existing = await Category.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
    if (existing) {
      return res.status(400).json({ message: 'A category with this name already exists' });
    }

    // Determine SKU prefix code: custom or auto-derived
    const categoryCode = (code && code.trim()) ? code.trim().toUpperCase() : deriveCategoryCode(name);

    let bannerImage = bodyBanner || '';
    if (req.file) {
      bannerImage = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const newCategory = new Category({
      name: name.trim(),
      code: categoryCode,
      slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || '',
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80',
      isActive: true
    });

    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, bannerImage: bodyBanner, isActive } = req.body;

    const updateData = {};
    if (name !== undefined) {
      updateData.name = name.trim();
      updateData.slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    if (code !== undefined) {
      updateData.code = code.trim().toUpperCase();
    }
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (req.file) {
      updateData.bannerImage = `http://localhost:5000/uploads/${req.file.filename}`;
    } else if (bodyBanner !== undefined) {
      updateData.bannerImage = bodyBanner;
    }

    const updated = await Category.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await Category.findById(id);
    if (!cat) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};
