// middleware/auth.js

import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not Authorized. Login again.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = token_decode.id;
    next();
  } catch (error) {
    console.error("JWT error:", error);
    res.status(401).json({ success: false, message: error.message });
  }
};

export default authUser;
