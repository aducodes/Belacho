import userModel from "../models/userModel.js";

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId; // Use userId from auth middleware
    const { itemId, size } = req.body;

    console.log("🟡 Add to Cart API called");
    console.log("User ID:", userId);
    console.log("Item ID:", itemId);
    console.log("Size:", size);

    const userData = await userModel.findById(userId);
    const cartData = { ...userData.cartData }; // clone cart data

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added to Cart" });

  } catch (error) {
    console.log("Add to Cart Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Update product quantity in cart
const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    const cartData = { ...userData.cartData };

    if (!cartData[itemId]) {
      return res.json({ success: false, message: "Item not found in cart" });
    }

    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });

  } catch (error) {
    console.log("Update Cart Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get user's cart data
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    const cartData = userData.cartData || {};

    res.json({ success: true, cartData });

  } catch (error) {
    console.log("Get Cart Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
