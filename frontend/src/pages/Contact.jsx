import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>
      
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Online Store</p>
          <p className='text-gray-500'>Belacho <br />Based in Kerala, India</p>
          <p className='text-gray-500'>Phone: +91 9539318194 <br /> Email: belachoofficial@gmail.com</p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default Contact
