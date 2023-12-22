import { useState, useEffect, useRef } from 'react';

export function useScrollDirection(threshold = 0) {
  const [scrollDirection, setScrollDirection] = useState('up');
  const blocking = useRef(false);
  const prevScrollY = useRef(0);

  useEffect(() => {
    // Check if window is defined
    if (typeof window !== "undefined") {
      prevScrollY.current = window.pageYOffset;

      const updateScrollDirection = () => {
        const scrollY = window.pageYOffset;

        if (Math.abs(scrollY - prevScrollY.current) >= threshold) {
          const newScrollDirection = scrollY > prevScrollY.current ? 'down' : 'up';
          setScrollDirection(newScrollDirection);
          prevScrollY.current = scrollY > 0 ? scrollY : 0;
        }

        blocking.current = false;
      };

      const onScroll = () => {
        if (!blocking.current) {
          blocking.current = true;
          window.requestAnimationFrame(updateScrollDirection);
        }
      };

      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, [threshold, scrollDirection]);

  return scrollDirection;
}