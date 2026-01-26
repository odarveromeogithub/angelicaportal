import AppRoute from "./Router";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "./core/contexts/ThemeContext";

function AppContent() {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <AppRoute />
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme={resolvedTheme as "light" | "dark"}
        duration={4000}
      />
    </>
  );
}

const MainApp = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default MainApp;
