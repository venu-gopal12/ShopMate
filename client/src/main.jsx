import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AuthProvider from "./context/AuthContext";

import { CartProvider } from "./context/CartContext";

import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <Toaster position="bottom-right" richColors closeButton />
      <App />
    </CartProvider>
  </AuthProvider>
);
