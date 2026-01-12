const productModel = require("../../../model/users/rajlaxmi/productModel");

// CREATE
exports.addProduct = async (req, res) => {
  try {
    // Input validation
    const requiredFields = [
      "product_name",
      "product_description",
      "product_category",
      "product_weight",
      "product_price",
      "purchase_price",
      "product_tax",
      "product_final_price",
      "product_stock",
    ];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    const productId = await productModel.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      productId,
    });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ ALL
exports.getProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ BY CATEGORY
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category parameter required",
      });
    }

    const products = await productModel.getProductsByCategory(category);
    res.json({
      success: true,
      category,
      data: products,
      count: products.length,
    });
  } catch (err) {
    console.error("Get products by category error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// SEARCH PRODUCTS
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search term 'q' parameter required",
      });
    }

    const products = await productModel.searchProducts(q);
    res.json({
      success: true,
      searchTerm: q,
      data: products,
      count: products.length,
    });
  } catch (err) {
    console.error("Search products error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ SINGLE
exports.getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID required",
      });
    }

    const product = await productModel.getProductById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    console.error("Get single product error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// LOW STOCK PRODUCTS
exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await productModel.getLowStockProducts();
    res.json({
      success: true,
      message: "Low stock products retrieved",
      data: products,
      count: products.length,
      lowStockThreshold: 10,
    });
  } catch (err) {
    console.error("Get low stock error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.body.product_id || req.params.id;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID required",
      });
    }

    const updated = await productModel.updateProduct(productId, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Product not found or no changes made",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      productId,
    });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// SOFT DELETE
exports.softDeleteProduct = async (req, res) => {
  try {
    const productId = req.params.id || req.body.product_id;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID required",
      });
    }

    const deleted = await productModel.softDeleteProduct(productId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product soft deleted successfully (status set to 0)",
      productId,
    });
  } catch (err) {
    console.error("Soft delete product error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// HARD DELETE
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id || req.body.product_id;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID required",
      });
    }

    const deleted = await productModel.deleteProduct(productId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product permanently deleted successfully",
      productId,
    });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = exports;

// const productModel = require("../../../model/users/rajlaxmi/productModel");

// // CREATE
// exports.addProduct = async (req, res) => {
//   try {
//     const productId = await productModel.createProduct(req.body);
//     console.log("req.body: ", req.body);
//     return res.status(201).json({
//       message: "Product created successfully",
//       productId,
//     });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// // READ ALL
// exports.getProducts = async (req, res) => {
//   try {
//     const products = await productModel.getAllProducts();
//     return res.json(products);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// // READ SINGLE
// exports.getSingleProduct = async (req, res) => {
//   try {
//     const product = await productModel.getProductById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     return res.json(product);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// // UPDATE
// exports.updateProduct = async (req, res) => {
//   try {
//     const updated = await productModel.updateProduct(req.params.id, req.body);
//     if (!updated) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     return res.json({ message: "Product updated successfully" });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// // DELETE
// exports.deleteProduct = async (req, res) => {
//   try {
//     const deleted = await productModel.deleteProduct(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     return res.json({ message: "Product deleted successfully" });
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };
