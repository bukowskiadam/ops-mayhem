import { useEffect, useRef } from 'react';

export const useAnimationFrame = (callback) => {
  const requestRef = useRef();

  const animate = () => {
    callback();

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
