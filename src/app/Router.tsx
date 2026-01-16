import { Navigate, Route, Routes } from "react-router-dom";
import AuthGuard from "./core/layout/AuthGuard";
import Login from "./modules/shared/auth/login";
import Register from "./modules/shared/auth/register";
import OtpVerification from "./modules/shared/auth/otp";
import AngelicaLifePlan from "./modules/shared/angelica-life-plan";
import Dashboard from "./modules/dashboard";

const AppRoute = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/angelica" element={<AngelicaLifePlan />} />

        {/* Protected routes */}
        <Route element={<AuthGuard />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoute;