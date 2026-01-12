const { withConnection } = require("../../../utils/helper");

const productModel = {
  // CREATE - Fixed column count issue
  createProduct: async (data) => {
    try {
      return await withConnection(async (connection) => {
        const query = `
          INSERT INTO rajlaxmi_products (
            product_name, product_description, product_category,
            product_weight, product_price, purchase_price,
            product_tax, product_final_price, product_stock, status,
            product_image_1, product_image_2, product_image_3, product_image_4
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Fixed: 14 parameters matching 14 columns
        const [result] = await connection.execute(query, [
          data.product_name,
          data.product_description,
          data.product_category,
          data.product_weight,
          data.product_price,
          data.purchase_price,
          data.product_tax,
          data.product_final_price,
          data.product_stock,
          data.status || 1, // 10th parameter
          data.product_image_1,
          data.product_image_2,
          data.product_image_3,
          data.product_image_4, // 14th parameter ✓
        ]);

        return result.insertId;
      });
    } catch (err) {
      throw new Error(`Create failed: ${err.message}`);
    }
  },

  // READ ALL - with ratings
  getAllProducts: async () => {
    try {
      return await withConnection(async (connection) => {
        const query = `
          SELECT 
            p.*,
            IFNULL(AVG(f.rating), 0) AS average_rating,
            COUNT(f.id) AS total_reviews
          FROM rajlaxmi_products p
          LEFT JOIN rajlaxmi_feedback f ON p.product_id = f.product_id
          GROUP BY p.product_id
          ORDER BY p.product_id DESC
        `;

        const [rows] = await connection.execute(query);
        return rows;
      });
    } catch (err) {
      throw new Error(`Fetch failed: ${err.message}`);
    }
  },

  // READ SINGLE
  getProductById: async (productId) => {
    try {
      return await withConnection(async (connection) => {
        const [rows] = await connection.execute(
          "SELECT * FROM rajlaxmi_products WHERE product_id = ?",
          [productId]
        );
        return rows[0];
      });
    } catch (err) {
      throw new Error(`Fetch single failed: ${err.message}`);
    }
  },

  // READ BY CATEGORY
  getProductsByCategory: async (category) => {
    try {
      return await withConnection(async (connection) => {
        const [rows] = await connection.execute(
          `SELECT 
            p.*,
            IFNULL(AVG(f.rating), 0) AS average_rating,
            COUNT(f.id) AS total_reviews
          FROM rajlaxmi_products p
          LEFT JOIN rajlaxmi_feedback f ON p.product_id = f.product_id
          WHERE p.product_category = ? AND p.status = 1
          GROUP BY p.product_id
          ORDER BY p.product_id DESC`,
          [category]
        );
        return rows;
      });
    } catch (err) {
      throw new Error(`Fetch by category failed: ${err.message}`);
    }
  },

  // SEARCH PRODUCTS
  searchProducts: async (searchTerm) => {
    try {
      return await withConnection(async (connection) => {
        const query = `
          SELECT 
            p.*,
            IFNULL(AVG(f.rating), 0) AS average_rating,
            COUNT(f.id) AS total_reviews
          FROM rajlaxmi_products p
          LEFT JOIN rajlaxmi_feedback f ON p.product_id = f.product_id
          WHERE p.status = 1 
          AND (p.product_name LIKE ? OR p.product_description LIKE ?)
          GROUP BY p.product_id
          ORDER BY p.product_id DESC
        `;
        const [rows] = await connection.execute(query, [
          `%${searchTerm}%`,
          `%${searchTerm}%`,
        ]);
        return rows;
      });
    } catch (err) {
      throw new Error(`Search failed: ${err.message}`);
    }
  },

  // UPDATE - Fixed parameter order
  updateProduct: async (productId, data) => {
    try {
      return await withConnection(async (connection) => {
        const query = `
          UPDATE rajlaxmi_products SET
            product_name = ?, product_description = ?,
            product_category = ?, product_weight = ?,
            product_price = ?, purchase_price = ?,
            product_tax = ?, product_final_price = ?,
            product_stock = ?, status = ?,
            product_image_1 = ?, product_image_2 = ?,
            product_image_3 = ?, product_image_4 = ?
          WHERE product_id = ?
        `;

        // Fixed: 15 parameters matching query (14 fields + WHERE condition)
        const [result] = await connection.execute(query, [
          data.product_name,
          data.product_description,
          data.product_category,
          data.product_weight,
          data.product_price,
          data.purchase_price,
          data.product_tax,
          data.product_final_price,
          data.product_stock,
          data.status || 1, // 10th parameter
          data.product_image_1,
          data.product_image_2,
          data.product_image_3,
          data.product_image_4, // 14th parameter
          productId, // 15th parameter (WHERE)
        ]);

        return result.affectedRows > 0;
      });
    } catch (err) {
      throw new Error(`Update failed: ${err.message}`);
    }
  },

  // SOFT DELETE (Set status = 0)
  softDeleteProduct: async (productId) => {
    try {
      return await withConnection(async (connection) => {
        const [result] = await connection.execute(
          "UPDATE rajlaxmi_products SET status = 0 WHERE product_id = ?",
          [productId]
        );
        return result.affectedRows > 0;
      });
    } catch (err) {
      throw new Error(`Soft delete failed: ${err.message}`);
    }
  },

  // HARD DELETE
  deleteProduct: async (productId) => {
    try {
      return await withConnection(async (connection) => {
        const [result] = await connection.execute(
          "DELETE FROM rajlaxmi_products WHERE product_id = ?",
          [productId]
        );
        return result.affectedRows > 0;
      });
    } catch (err) {
      throw new Error(`Delete failed: ${err.message}`);
    }
  },

  // GET LOW STOCK PRODUCTS
  getLowStockProducts: async () => {
    try {
      return await withConnection(async (connection) => {
        const [rows] = await connection.execute(
          "SELECT * FROM rajlaxmi_products WHERE product_stock <= 10 AND status = 1 ORDER BY product_stock ASC"
        );
        return rows;
      });
    } catch (err) {
      throw new Error(`Low stock fetch failed: ${err.message}`);
    }
  },
};

module.exports = productModel;

// const { withConnection } = require("../../../utils/helper");

// // CREATE
// exports.createProduct = async (data) => {
//   console.log("data: ", data);
//   try {
//     return await withConnection(async (connection) => {
//       const query = `
//         INSERT INTO rajlaxmi_products (
//           product_name, product_description, product_category,
//           product_weight, product_price, purchase_price,
//           product_tax, product_final_price, product_stock,
//           product_image_1, product_image_2, product_image_3, product_image_4
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;

//       const [result] = await connection.execute(query, [
//         data.product_name,
//         data.product_description,
//         data.product_category,
//         data.product_weight,
//         data.product_price,
//         data.purchase_price,
//         data.product_tax,
//         data.product_final_price,
//         data.product_stock,
//         data.product_image_1,
//         data.product_image_2,
//         data.product_image_3,
//         data.product_image_4,
//       ]);

//       return result.insertId;
//     });
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

// // READ ALL
// exports.getAllProducts = async () => {
//   try {
//     return await withConnection(async (connection) => {
//       const query = `
//         SELECT
//           p.*,
//           IFNULL(AVG(f.rating), 0) AS average_rating,
//           COUNT(f.id) AS total_reviews
//         FROM rajlaxmi_products p
//         LEFT JOIN rajlaxmi_feedback f
//           ON p.product_id = f.product_id
//         WHERE p.status = 1
//         GROUP BY p.product_id
//         ORDER BY p.product_id DESC
//       `;

//       const [rows] = await connection.execute(query);
//       return rows;
//     });
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

// // READ SINGLE
// exports.getProductById = async (productId) => {
//   try {
//     return await withConnection(async (connection) => {
//       const [rows] = await connection.execute(
//         "SELECT * FROM rajlaxmi_products WHERE product_id = ?",
//         [productId]
//       );
//       return rows[0];
//     });
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

// // UPDATE
// exports.updateProduct = async (productId, data) => {
//   try {
//     return await withConnection(async (connection) => {
//       const query = `
//         UPDATE rajlaxmi_products SET
//           product_name = ?,
//           product_description = ?,
//           product_category = ?,
//           product_weight = ?,
//           product_price = ?,
//           purchase_price = ?,
//           product_tax = ?,
//           product_final_price = ?,
//           product_stock = ?,
//           product_image_1 = ?,
//           product_image_2 = ?,
//           product_image_3 = ?,
//           product_image_4 = ?
//         WHERE product_id = ?
//       `;

//       const [result] = await connection.execute(query, [
//         data.product_name,
//         data.product_description,
//         data.product_category,
//         data.product_weight,
//         data.product_price,
//         data.purchase_price,
//         data.product_tax,
//         data.product_final_price,
//         data.product_stock,
//         data.product_image_1,
//         data.product_image_2,
//         data.product_image_3,
//         data.product_image_4,
//         productId,
//       ]);

//       return result.affectedRows;
//     });
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

// // DELETE (SOFT)
// exports.deleteProduct = async (productId) => {
//   try {
//     return await withConnection(async (connection) => {
//       const [result] = await connection.execute(
//         "UPDATE rajlaxmi_products SET status = 0 WHERE product_id = ?",
//         [productId]
//       );
//       return result.affectedRows;
//     });
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };
