import AppRoute from "./Router";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

const MainApp = () => {
  return (
      <BrowserRouter>
        <AppRoute />
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="light"
          duration={4000}
        />
      </BrowserRouter>
  );
};

export default MainApp;