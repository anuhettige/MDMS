import "./index.css";
import React from "react";
import { render } from "react-dom";
import { App } from "./App";
import { AuthProvider } from "./context/AuthContext"; // ✅ Import the AuthProvider
import { ThemeProvider } from "./context/ThemeProvider";

render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        {" "}
        {/* ✅ Wrap App with AuthProvider */}
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
