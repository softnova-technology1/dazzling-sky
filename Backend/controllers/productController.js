const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    
    let imageUrl = '';
    if (req.file) {
      imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: 'Please provide an image file' });
    }

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      imageUrl,
      stock: stock || 0
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
    const { name, description, price, category, stock } = req.body;
    
    const updateData = { name, description, price, category, stock };
    
    if (req.file) {
      updateData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
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

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
