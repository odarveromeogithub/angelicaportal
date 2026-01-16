import { Navigate, Route, Routes } from "react-router-dom";
import AuthGuard from "./core/layout/AuthGuard";
import Login from "./modules/shared/auth/login";
import Register from "./modules/shared/auth/register";
import OtpVerification from "./modules/shared/auth/otp";
import AngelicaLifePlan from "./modules/shared/angelica-life-plan";
import Dashboard from "./modules/dashboard";
import { APP_ROUTES } from "./core/constants/routes";

const AppRoute = () => {
  return (
    <Routes>
      <Route path={APP_ROUTES.HOME} element={<Navigate to={APP_ROUTES.LOGIN} />} />
      
      {/* Public routes */}
      <Route path={APP_ROUTES.LOGIN} element={<Login />} />
      <Route path={APP_ROUTES.REGISTER} element={<Register />} />
      <Route path={APP_ROUTES.OTP} element={<OtpVerification />} />
      <Route path={APP_ROUTES.ANGELICA_LIFE_PLAN} element={<AngelicaLifePlan />} />

      {/* Protected routes */}
      <Route element={<AuthGuard />}>
        <Route path={APP_ROUTES.DASHBOARD} element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoute;