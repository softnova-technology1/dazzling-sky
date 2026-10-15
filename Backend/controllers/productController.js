const Product = require('../models/Product');
const { generateNextProductSku } = require('../utils/skuGenerator');

// Get next recommended SKU for a category
exports.getNextSku = async (req, res) => {
  try {
    const { category, code } = req.query;
    const skuData = await generateNextProductSku(category || 'Bouquets', code);
    res.status(200).json(skuData);
  } catch (error) {
    res.status(500).json({ message: 'Error generating SKU', error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get single product by ID (supports ObjectId or legacyId)
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const mongoose = require('mongoose');
    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean();
    }
    if (!product && !isNaN(Number(id))) {
      product = await Product.findOne({ legacyId: Number(id) }).lean();
    }
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { 
      name, description, longDescription, careInstructions, 
      dimensions, longevity, price, category, collectionName, 
      stock, color, occasion, flowerType, tag, sku
    } = req.body;
    
    let imageUrl = '';
    if (req.file) {
      imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({ message: 'Please provide an image file or imageUrl' });
    }

    if (!name || !price) {
      return res.status(400).json({ message: 'Please provide at least product name and price' });
    }

    // Determine SKU: use provided SKU or auto-generate DZ-[CAT]-XX
    let finalSku = (sku || '').trim().toUpperCase();
    if (!finalSku) {
      const generated = await generateNextProductSku(category || 'Bouquets');
      finalSku = generated.sku;
    }

    const newProduct = new Product({
      name,
      sku: finalSku,
      description: description || `Exquisite handcrafted floral arrangement curated for luxury occasions.`,
      longDescription: longDescription || description || '',
      careInstructions: careInstructions || '',
      dimensions: dimensions || 'Height: 18" | Diameter: 14"',
      longevity: longevity || '10-14 days with proper care',
      price: Number(price),
      category: category || 'Bouquets',
      collectionName: collectionName || category || 'Signature Collection',
      imageUrl,
      stock: stock !== undefined ? Number(stock) : 20,
      color: color || 'purple',
      occasion: occasion || 'Romance',
      flowerType: flowerType || 'Roses',
      tag: tag || ''
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, description, longDescription, careInstructions,
      dimensions, longevity, price, category, collectionName,
      stock, color, occasion, flowerType, tag, imageUrl: bodyImageUrl,
      sku, isActive
    } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (sku !== undefined) updateData.sku = (sku || '').trim().toUpperCase();
    if (description !== undefined) updateData.description = description;
    if (longDescription !== undefined) updateData.longDescription = longDescription;
    if (careInstructions !== undefined) updateData.careInstructions = careInstructions;
    if (dimensions !== undefined) updateData.dimensions = dimensions;
    if (longevity !== undefined) updateData.longevity = longevity;
    if (price !== undefined) updateData.price = Number(price);
    if (category !== undefined) updateData.category = category;
    if (collectionName !== undefined) updateData.collectionName = collectionName;
    if (stock !== undefined) updateData.stock = Number(stock);
    if (isActive !== undefined) updateData.isActive = (isActive === true || isActive === 'true');
    if (color !== undefined) updateData.color = color;
    if (occasion !== undefined) updateData.occasion = occasion;
    if (flowerType !== undefined) updateData.flowerType = flowerType;
    if (tag !== undefined) updateData.tag = tag;
    
    if (req.file) {
      updateData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    } else if (bodyImageUrl) {
      updateData.imageUrl = bodyImageUrl;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Inventory Dashboard & Alerts
exports.getInventory = async (req, res) => {
  try {
    const products = await Product.find().sort({ stock: 1, name: 1 }).lean();
    
    const totalSkus = products.length;
    const healthyStock = products.filter(p => p.stock >= 5).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock < 5).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const totalUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);

    res.status(200).json({
      summary: {
        totalSkus,
        healthyStock,
        lowStock,
        outOfStock,
        totalUnits
      },
      products
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory', error: error.message });
  }
};

// Quick Stock Update for a Single Product
exports.quickUpdateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    
    if (stock === undefined || isNaN(Number(stock))) {
      return res.status(400).json({ message: 'Valid stock number is required' });
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { stock: Math.max(0, Number(stock)) },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Stock updated successfully', product: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error: error.message });
  }
};

// Bulk Stock Update
exports.bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, stock }
    if (!Array.isArray(updates)) {
      return res.status(400).json({ message: 'Updates array is required' });
    }

    const bulkOps = updates.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { stock: Math.max(0, Number(item.stock)) } }
      }
    }));

    await Product.bulkWrite(bulkOps);
    res.status(200).json({ message: `Successfully updated ${updates.length} products` });
  } catch (error) {
    res.status(500).json({ message: 'Error performing bulk update', error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const path = require('path');
    const fs = require('fs');
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Clean up orphan image file on disk if it exists in uploads/
    if (deletedProduct.imageUrl && deletedProduct.imageUrl.includes('/uploads/')) {
      const filename = path.basename(deletedProduct.imageUrl);
      const filePath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.error('Failed to delete image file:', unlinkErr.message);
        }
      }
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Toggle product active status (Active <-> Inactive)
exports.toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.body && typeof req.body.isActive === 'boolean') {
      product.isActive = req.body.isActive;
    } else {
      const currentActive = product.isActive !== false;
      product.isActive = !currentActive;
    }

    await product.save();

    res.status(200).json({ 
      message: `Product "${product.name}" ${product.isActive ? 'activated' : 'deactivated'} successfully`, 
      product 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling product status', error: error.message });
  }
};

