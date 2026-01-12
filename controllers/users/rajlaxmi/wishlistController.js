const asyncHandler = require("express-async-handler");
const wishlistModel = require("../../../model/users/rajlaxmi/wishlistModel");

// ADD TO WISHLIST
exports.addWishlist = asyncHandler(async (req, res) => {
  const {
    uid,
    product_id,
    product_name,
    product_price,
    product_quantity = 1,
    product_image,
  } = req.body;

  // Input validation
  if (
    !uid ||
    !product_id ||
    !product_name ||
    !product_price ||
    !product_image
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: uid, product_id, product_name, product_price, product_image",
    });
  }

  // Check if item already exists
  const exists = await wishlistModel.checkWishlistItem(uid, product_id);
  if (exists) {
    return res.status(409).json({
      success: false,
      message: "Item already exists in wishlist",
    });
  }

  const result = await wishlistModel.addWishlist({
    uid,
    product_id,
    product_name,
    product_price,
    product_quantity,
    product_image,
  });

  res.status(201).json({
    success: true,
    message: "Added to wishlist successfully!",
    data: result,
  });
});

// GET USER WISHLIST
exports.getUserWishlist = asyncHandler(async (req, res) => {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({
      success: false,
      message: "User ID (uid) is required",
    });
  }

  const result = await wishlistModel.getUserWishlist(uid);

  res.json({
    success: true,
    message: "Wishlist fetched successfully",
    ...result,
  });
});

// REMOVE SPECIFIC ITEM
exports.removeWishlistItem = asyncHandler(async (req, res) => {
  const { uid, product_id } = req.body;

  if (!uid || !product_id) {
    return res.status(400).json({
      success: false,
      message: "uid and product_id are required",
    });
  }

  const result = await wishlistModel.removeWishlistItem(uid, product_id);

  res.json({
    success: result.success,
    message: result.message,
    data: result,
  });
});

// CLEAR ENTIRE WISHLIST
exports.clearWishlist = asyncHandler(async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({
      success: false,
      message: "User ID (uid) is required",
    });
  }

  const result = await wishlistModel.clearUserWishlist(uid);

  res.json({
    success: true,
    message: "Wishlist cleared successfully",
    data: result,
  });
});

// GET WISHLIST COUNT
exports.getWishlistCount = asyncHandler(async (req, res) => {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({
      success: false,
      message: "User ID (uid) is required",
    });
  }

  const count = await wishlistModel.getWishlistCount(uid);

  res.json({
    success: true,
    count,
    message: `User has ${count} items in wishlist`,
  });
});
