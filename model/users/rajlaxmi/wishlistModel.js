const { withConnection } = require("../../../utils/helper");

const wishlistModel = {
  // ADD TO WISHLIST
  addWishlist: async (wishlistData) => {
    try {
      return await withConnection(async (connection) => {
        const {
          uid,
          product_id,
          product_name,
          product_price,
          product_quantity = 1,
          product_image,
        } = wishlistData;

        const query = `
          INSERT INTO rajlaxmi_wishlist (
            uid, product_id, product_name, product_price, 
            product_quantity, product_image
          ) VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await connection.execute(query, [
          uid,
          product_id,
          product_name,
          parseFloat(product_price),
          parseInt(product_quantity),
          product_image,
        ]);

        return {
          success: true,
          message: "Wishlist item added successfully",
          insertId: result.insertId,
        };
      });
    } catch (error) {
      console.error("Model - Add wishlist error:", error);
      throw new Error(`Failed to add wishlist: ${error.message}`);
    }
  },

  // GET USER WISHLIST (MAIN)
  getUserWishlist: async (uid) => {
    try {
      return await withConnection(async (connection) => {
        if (!uid) {
          return { success: false, data: [], message: "User ID required" };
        }

        const query = `
          SELECT 
            *,
            DATE_FORMAT(created_at, '%d %M %Y %h:%i %p') as formatted_date
          FROM rajlaxmi_wishlist 
          WHERE uid = ? 
          ORDER BY created_at DESC
        `;

        const [rows] = await connection.execute(query, [uid]);
        return {
          success: true,
          data: rows,
          count: rows.length,
        };
      });
    } catch (error) {
      console.error("Model - Get wishlist error:", error);
      throw new Error(`Failed to fetch wishlist: ${error.message}`);
    }
  },

  // CHECK IF ITEM EXISTS IN WISHLIST
  checkWishlistItem: async (uid, product_id) => {
    try {
      return await withConnection(async (connection) => {
        const query = `SELECT id FROM rajlaxmi_wishlist WHERE uid = ? AND product_id = ?`;
        const [rows] = await connection.execute(query, [uid, product_id]);
        return rows.length > 0;
      });
    } catch (error) {
      console.error("Model - Check wishlist item error:", error);
      throw error;
    }
  },

  // REMOVE SPECIFIC ITEM
  removeWishlistItem: async (uid, product_id) => {
    try {
      return await withConnection(async (connection) => {
        const query = `DELETE FROM rajlaxmi_wishlist WHERE uid = ? AND product_id = ?`;
        const [result] = await connection.execute(query, [uid, product_id]);

        if (result.affectedRows === 0) {
          return { success: false, message: "Wishlist item not found" };
        }

        return {
          success: true,
          message: "Wishlist item removed successfully",
          affectedRows: result.affectedRows,
        };
      });
    } catch (error) {
      console.error("Model - Remove wishlist item error:", error);
      throw new Error(`Failed to remove wishlist item: ${error.message}`);
    }
  },

  // CLEAR ENTIRE WISHLIST
  clearUserWishlist: async (uid) => {
    try {
      return await withConnection(async (connection) => {
        const query = `DELETE FROM rajlaxmi_wishlist WHERE uid = ?`;
        const [result] = await connection.execute(query, [uid]);
        return {
          success: true,
          message: "Wishlist cleared successfully",
          affectedRows: result.affectedRows,
        };
      });
    } catch (error) {
      console.error("Model - Clear wishlist error:", error);
      throw new Error(`Failed to clear wishlist: ${error.message}`);
    }
  },

  // GET WISHLIST COUNT
  getWishlistCount: async (uid) => {
    try {
      return await withConnection(async (connection) => {
        const query = `SELECT COUNT(*) as count FROM rajlaxmi_wishlist WHERE uid = ?`;
        const [rows] = await connection.execute(query, [uid]);
        return rows[0].count;
      });
    } catch (error) {
      console.error("Model - Wishlist count error:", error);
      throw error;
    }
  },
};

module.exports = wishlistModel;

// const { withConnection } = require("../../../utils/helper");

// exports.addWishlist = async ({
//   uid,
//   product_id,
//   product_name,
//   product_price,
//   product_quantity,
//   product_image, // Added product_image
// }) => {
//   try {
//     return await withConnection(async (connection) => {
//       const query = `INSERT INTO rajlaxmi_wishlist (uid, product_id, product_name, product_price, product_quantity, product_image) VALUES (?, ?, ?, ?, ?, ?)`; // Updated query

//       // Executing the insert query
//       const [result] = await connection.execute(query, [
//         uid,
//         product_id,
//         product_name,
//         product_price,
//         product_quantity,
//         product_image, // Added product_image
//       ]);

//       return {
//         message: "Wishlist item added successfully",
//         insertId: result.insertId,
//       };
//     });
//   } catch (error) {
//     console.error("Error adding to wishlist:", error);
//     throw error; // Ensure the error propagates to the controller
//   }
// };

// // Get All Wishlist
// exports.getAllWishlistAll = async () => {
//   try {
//     return await withConnection(async (connection) => {
//       const query = `SELECT * FROM rajlaxmi_wishlist WHERE uid = ?`;
//       const [products] = await connection.execute(query);
//       return products;
//     });
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// exports.getAllWishlist = async (id) => {
//   try {
//     return await withConnection(async (connection) => {
//       const [rows] = await connection.query(
//         `SELECT * FROM rajlaxmi_wishlist WHERE uid = ?`,
//         [id]
//       );
//       return rows;
//     });
//   } catch (error) {
//     console.log("error: ", error);
//     throw error;
//   }
// };

// // Remove wishlist
// // exports.removeFromWishlist = async (uid) => {
// //     try {
// //         return await withConnection(async (connection) => {
// //             const query = `DELETE FROM rajlaxmi_wishlist WHERE uid = ?`;

// //             // Executing the delete query
// //             const [result] = await connection.execute(query, [uid]);

// //             // Check if any rows were affected (deleted)
// //             if (result.affectedRows === 0) {
// //                 return null;  // No wishlist item was removed
// //             }

// //             return { message: "Wishlist item removed successfully", affectedRows: result.affectedRows };
// //         });
// //     } catch (error) {
// //         console.error("Error removing wishlist", error);
// //     }
// // };

// exports.removeFromWishlist = async (uid, product_id) => {
//   try {
//     return await withConnection(async (connection) => {
//       const query = `DELETE FROM rajlaxmi_wishlist WHERE uid = ? AND product_id = ?`;

//       // Executing the delete query
//       const [result] = await connection.execute(query, [uid, product_id]);

//       // Check if any rows were affected (deleted)
//       if (result.affectedRows === 0) {
//         return null; // No wishlist item was removed
//       }

//       return {
//         message: "Wishlist item removed successfully",
//         affectedRows: result.affectedRows,
//       };
//     });
//   } catch (error) {
//     console.error("Error removing wishlist:", error);
//     throw error; // Ensure the error propagates to the calling function
//   }
// };
