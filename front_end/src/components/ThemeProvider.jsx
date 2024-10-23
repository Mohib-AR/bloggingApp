import React from "react";
import { useSelector } from "react-redux";
export default function ThemeProvider({ children }) {
  const { theme } = useSelector((store) => store.theme);

  return (
    <>
      <div className={theme}>
        <div className="text-gray-700 bg-white dark:text-gray-200 dark:bg-[rgb(16,33,42)] min-h-screen">
          {children}
        </div>
      </div>
    </>
  );
}
