import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  // 🔐 Decode JWT to get user info
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  };

  const applyCoupon = (code) => {
    const trimmedCode = code.trim().toUpperCase();
    if (trimmedCode === "BELACHO10") {
      setCoupon(trimmedCode);
      setDiscount(0.10);
      toast.success("Coupon applied successfully!");
      return { success: true };
    } else {
      setCoupon("");
      setDiscount(0);
      toast.error("Invalid coupon code");
      return { success: false };
    }
  };

  const getDiscountAmount = () => {
    return getCartAmount() * discount;
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    const cartData = structuredClone(cartItems);
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log("Add to cart error:", error);
        toast.error("Failed to sync cart with server");
      }
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId][size] = quantity;
      setCartItems(cartData);

      if (token) {
        try {
          await axios.post(
            `${backendUrl}/api/cart/update`,
            { itemId, size, quantity },
            { headers: { token } }
          );
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        totalCount += cartItems[itemId][size];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (!product) continue;

      for (const size in cartItems[itemId]) {
        const qty = cartItems[itemId][size];
        totalAmount += product.price * qty;
      }
    }
    return totalAmount;
  };

  const fetchCartFromBackend = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        setCartItems(res.data.cartData);
      } else {
        console.warn("Cart fetch failed:", res.data.message);
      }
    } catch (error) {
      console.log("Error fetching cart data:", error);
    }
  };

  const getProductsData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/cart/get',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Initial fetch
  useEffect(() => {
    getProductsData();
  }, []);

  // On app load — load token & decode user
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
      const decodedUser = decodeToken(localToken);
      if (decodedUser) {
        setUser(decodedUser);
      }
      getUserCart(localToken);
    }
  }, []);

  // Whenever token changes, fetch cart again
  useEffect(() => {
    if (token) {
      fetchCartFromBackend();
    }
  }, [token]);

  const contextValue = {
    products,
    currency,
    delivery_fee,
    backendUrl,

    search,
    setSearch,
    showSearch,
    setShowSearch,

    cartItems,
    addToCart,
    setCartItems,
    updateQuantity,
    getCartCount,
    getCartAmount,

    setToken,
    token,
    user,
    navigate,

    coupon,
    discount,
    applyCoupon,
    getDiscountAmount,
    setCoupon,
    setDiscount,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
