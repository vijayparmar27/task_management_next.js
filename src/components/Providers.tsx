"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { store } from "@/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import LoadingSpinner from "./LoadingSpinner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ToastContainer position="top-right" />
        <LoadingSpinner />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
