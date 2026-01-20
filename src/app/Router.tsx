import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthGuard from "./core/layout/AuthGuard";
import { APP_ROUTES } from "./core/constants/routes";

// Lazy load auth components
const Login = lazy(() => import("./modules/shared/auth/login"));
const Register = lazy(() => import("./modules/shared/auth/register"));
const OtpVerification = lazy(() => import("./modules/shared/auth/otp"));

// Lazy load dashboard and forms
const AngelicaLifePlan = lazy(() => import("./modules/shared/angelica-life-plan"));
const Dashboard = lazy(() => import("./modules/dashboard"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
    <div className="text-center">
      <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4" />
      <p className="text-sm sm:text-base text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

const AppRoute = () => {
  return (
    <Routes>
      <Route path={APP_ROUTES.HOME} element={<Navigate to={APP_ROUTES.LOGIN} />} />
      
      {/* Public routes with suspense boundary */}
      <Route 
        path={APP_ROUTES.LOGIN} 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Login />
          </Suspense>
        } 
      />
      <Route 
        path={APP_ROUTES.REGISTER} 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Register />
          </Suspense>
        } 
      />
      <Route 
        path={APP_ROUTES.OTP} 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <OtpVerification />
          </Suspense>
        } 
      />
      <Route 
        path={APP_ROUTES.ANGELICA_LIFE_PLAN} 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AngelicaLifePlan />
          </Suspense>
        } 
      />

      {/* Protected routes */}
      <Route element={<AuthGuard />}>
        <Route 
          path={APP_ROUTES.DASHBOARD} 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
          } 
        />
      </Route>
    </Routes>
  );
};

export default AppRoute;