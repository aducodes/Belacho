// src/pages/OrderSuccess.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Order Placed Successfully!</h1>
      <p className="text-gray-700 text-lg mb-6">
        Thank you for your purchase. Your order has been placed and is being processed.
      </p>
      <Link to="/" className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;