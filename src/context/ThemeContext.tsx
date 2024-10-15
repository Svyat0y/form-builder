import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from 'react';
import { StorageKey, Theme } from '../types/enums';

export const ThemeContext = createContext({
  isDarkTheme: false,
  toggleTheme: () => {},
});

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    return localStorage.getItem(StorageKey.Theme) === Theme.Dark;
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDarkTheme ? Theme.Dark : Theme.Light
    );
    localStorage.setItem(
      StorageKey.Theme,
      isDarkTheme ? Theme.Dark : Theme.Light
    );
  }, [isDarkTheme]);

  const toggleTheme = () => setIsDarkTheme((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
