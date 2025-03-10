import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/ui/theme-provider.tsx";
import ConfirmationDialog from "./components/Error/ConfirmationDialog.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <ConfirmationDialog />
    </ThemeProvider>
  </StrictMode>
);
