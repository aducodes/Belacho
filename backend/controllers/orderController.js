// controllers/orderController.js

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Controller for placing an order using Google Pay
const placeOrderGooglePay = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address, amount, paymentInfo } = req.body;

    const newOrder = new orderModel({
      userId,
      items,
      address,
      amount,
      paymentInfo,
      status: "processing",
      createdAt: new Date()
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("Place order error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Admin: Fetch all orders
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch all orders error:", error);
    res.json({ success: false, message: error.message });
  }
};

// User: Fetch their own orders
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch user orders error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Admin: Update order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error("Update status error:", error);
    res.json({ success: false, message: error.message });
  }
};

export { placeOrderGooglePay, allOrders, userOrders, updateStatus };