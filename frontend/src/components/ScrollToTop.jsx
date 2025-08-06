import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ensure scroll happens after DOM updates
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    // Delay scroll slightly to allow page render
    const timeout = setTimeout(scrollToTop, 50);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
