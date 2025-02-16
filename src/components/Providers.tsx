"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { store } from "@/store";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // fetch user data
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ToastContainer position="top-right" />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
