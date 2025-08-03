import React from 'react';
import { useNavigate } from 'react-router-dom';

const NewsletterBox = () => {
  const navigate = useNavigate(); // Must be inside the component

  const handleRedirect = () => {
    navigate('/collection'); // Use navigate here safely
  };

  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>Order now at 10% off</p>
      <p className='text-gray-400 mt-3'>
        Grab your favorites while they last! Enjoy an exclusive 10% discount on your purchase — limited-time offer. Don’t miss the deal, shop now and save!
      </p>
      <button onClick={handleRedirect} className='bg-black border-white-1 text-white text-xs px-10 py-4 my-5 hover:text-black hover:border-1 hover:bg-white hover:transition duration-300'>ORDER NOW</button>
    </div>
  );
};

export default NewsletterBox;
