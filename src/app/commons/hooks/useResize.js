import { useState, useEffect } from 'preact/hooks';

export const useResize = (ref) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  if (ref.current) {
    setWidth(ref.current.clientWidth);
    setHeight(ref.current.clientHeight);
  }

  useEffect(() => {
    const handleResize = () => {
      setWidth(ref.current.clientWidth);
      setHeight(ref.current.clientHeight);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ref])

  return { width, setWidth, height, setHeight };
};
