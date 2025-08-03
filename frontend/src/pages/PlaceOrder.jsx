import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets/assets';

const keralaDistricts = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha",
  "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad",
  "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

const PlaceOrder = () => {
  const [method, setMethod] = useState('googlepay');
  const [couponInput, setCouponInput] = useState('');
  const [invalidCoupon, setInvalidCoupon] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    district: '',
    pincode: '',
    phone: '',
  });

  const navigate = useNavigate();
  const {
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    applyCoupon,
    discount,
    coupon
  } = useContext(ShopContext);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponInput);
    setInvalidCoupon(!result.success);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const totalAmount = (getCartAmount() + delivery_fee).toFixed(2);
    const upiLink = `upi://pay?pa=yourupiid@okaxis&pn=Your%20Bakery&am=${totalAmount}&cu=INR&tn=Order%20Payment`;

    if (method === 'googlepay') {
      window.open(upiLink, '_blank');
      const confirmed = window.confirm('After completing the payment in Google Pay, click OK to place your order.');
      if (!confirmed) return;
    }

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: parseFloat(totalAmount),
        paymentInfo: {
          method: method,
          status: method === 'googlepay' ? 'pending_confirmation' : 'unpaid'
        }
      };

      const response = await fetch(`${backendUrl}/api/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setCartItems({});
        navigate('/order-success');
      } else {
        console.error('Order placement failed');
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      
      {/* Left Side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
        </div>

        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />

        <div className='flex gap-3'>
          <select required onChange={onChangeHandler} name='district' value={formData.district} className='border border-gray-300 rounded py-1.3 px-2.5 w-full text-gray-500'>
            <option value="">Select District</option>
            {keralaDistricts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
          <input readOnly value="Kerala" className='border border-gray-300 rounded py-1.5 px-3.5 w-full bg-gray-100 cursor-not-allowed text-gray-500' />
        </div>

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='pincode' value={formData.pincode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Pincode' />
        </div>

        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
      </div>

      {/* Right Side */}
      <div className='mt-8 w-full sm:max-w-[400px]'>

        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        {/* Coupon Section */}
        <div className='mt-6'>
          {discount === 0 ? (
            <div className='flex flex-col gap-2'>
              <input
                type='text'
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder='Enter coupon code'
                className='border p-2 rounded outline-none text-sm'
              />
              <button
                type='button'
                onClick={handleApplyCoupon}
                className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm'
              >
                Apply Coupon
              </button>
              {invalidCoupon && (
                <p className='text-red-600 text-xs'>Invalid coupon code</p>
              )}
            </div>
          ) : (
            <p className='text-green-600 text-sm'>Coupon "{coupon}" applied successfully!</p>
          )}
        </div>

        {/* Payment Section */}
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div
              onClick={() => setMethod('googlepay')}
              className='flex items-center gap-3 border p-2 px-3 cursor-pointer'
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'googlepay' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.googlepay_logo} alt="googlepay" />
            </div>
          </div>

          <div className='w-full text-center mt-8'>
            <button
              type='submit'
              className='bg-black text-white px-16 py-3 text-sm'
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
