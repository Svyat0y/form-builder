import React, {
  createContext,
  ReactNode,
  useEffect,
  useState,
  FC,
} from 'react';
import { StorageKey, Theme } from '../types/enums';

export const ThemeContext = createContext({
  darkTheme: false,
  toggleTheme: () => {},
});

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const localStorageTheme = localStorage.getItem(StorageKey.Theme);

  const [isDarkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    if (localStorageTheme) {
      const isLocalThemeDark = localStorageTheme === Theme.Dark;
      document.documentElement.setAttribute('data-theme', localStorageTheme);
      if (isLocalThemeDark !== isDarkTheme) {
        setDarkTheme(isLocalThemeDark);
      }
    }
  }, [localStorageTheme]);

  useEffect(() => {
    const theme = isDarkTheme ? Theme.Dark : Theme.Light;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(StorageKey.Theme, theme);
  }, [isDarkTheme]);

  const toggleThemeHandler = () => setDarkTheme((prevState) => !prevState);

  return (
    <ThemeContext.Provider
      value={{
        darkTheme: isDarkTheme,
        toggleTheme: toggleThemeHandler,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
