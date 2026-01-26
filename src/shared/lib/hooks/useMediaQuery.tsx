import { useState, useEffect } from 'react'

export const useMediaQuery = (
  query: string,
  initialValue: boolean = true,
): boolean => {
  const [matches, setMatches] = useState<boolean>(initialValue)

  useEffect(() => {
    const mediaQueryList: MediaQueryList = window.matchMedia(query)
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQueryList.addEventListener('change', handleChange)
    setMatches(mediaQueryList.matches)

    return () => {
      mediaQueryList.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}
