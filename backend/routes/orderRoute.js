import express from 'express';
import {
    placeOrderGooglePay,
    allOrders,
    userOrders,
    updateStatus
} from '../controllers/orderController.js';

import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin routes
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// User routes
orderRouter.post('/', authUser, placeOrderGooglePay);       // Place order via Google Pay
orderRouter.post('/userorders', authUser, userOrders);      // Get user orders

export default orderRouter;
