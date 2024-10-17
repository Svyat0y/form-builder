// useMediaQuery.ts
import { useState, useEffect } from 'react';

export const useMediaQuery = (
  query: string,
  initialValue: boolean = true,
): boolean => {
  const [matches, setMatches] = useState<boolean>(initialValue);

  useEffect(() => {
    const mediaQueryList: MediaQueryList = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener('change', handleChange);

    // Set the initial state
    setMatches(mediaQueryList.matches);

    // Clean up event listener on unmount
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};
