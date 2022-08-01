import React, { useLayoutEffect, useState } from 'react';

const useWindowSize=(callBack)=> {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    callBack();
    const updateSize=()=> setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export default useWindowSize