import { useState, useEffect } from 'react';

export function useScreenSize() {
  let [minSize, setMinSize] = useState(() => {
    let { innerWidth, innerHeight } = window;
    return Math.min(innerWidth, innerHeight);
  });

  useEffect(() => {
    let handleResize = () => {
      let { innerWidth, innerHeight } = window;
      setMinSize(Math.min(innerWidth, innerHeight));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return minSize;
}
