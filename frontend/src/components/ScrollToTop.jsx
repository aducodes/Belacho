import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset scroll after full paint using requestAnimationFrame
    const scrollToTop = () => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant', // try "auto" or "instant"
          });
        }, 0);
      });
    };

    scrollToTop();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
