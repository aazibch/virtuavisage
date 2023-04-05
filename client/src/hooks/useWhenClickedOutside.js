import { useEffect, useRef } from 'react';

export default function useWhenClickedOutside(handler) {
  const domNodeRef = useRef();

  useEffect(() => {
    const callback = (event) => {
      if (!domNodeRef.current?.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener('mousedown', callback);

    return () => {
      document.removeEventListener('mousedown', callback);
    };
  }, []);

  return domNodeRef;
}
