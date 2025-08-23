import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import OrderSuccess from './pages/OrderSuccess';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from './components/ErrorBoundary'; // ✅ Import

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <ToastContainer />
        <Navbar />
        <SearchBar />
        
        {/* ✅ Wrap your routes inside ErrorBoundary */}
        <ErrorBoundary>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/collection' element={<Collection />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/products/:productsId' element={<Products />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/login' element={<Login />} />
            <Route path='/place-order' element={<PlaceOrder />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/order-success' element={<OrderSuccess />} />
          </Routes>
        </ErrorBoundary>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
