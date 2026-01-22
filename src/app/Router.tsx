import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthGuard from "./core/layout/AuthGuard";
import { APP_ROUTES } from "./core/constants/routes";
import { DASHBOARD_ROOT, DASHBOARD_SEGMENTS, buildDashboardPath } from "./core/constants/paths";

// Lazy load auth components
const Login = lazy(() => import("./modules/shared/auth/login"));
const Register = lazy(() => import("./modules/shared/auth/register"));
const OtpVerification = lazy(() => import("./modules/shared/auth/otp"));

// Lazy load dashboard and forms
const AngelicaLifePlan = lazy(() => import("./modules/shared/angelica-life-plan"));

// Lazy load dashboard pages
const AngelicaPage = lazy(() => import("./modules/dashboard/AngelicaPage"));
const ProfilePage = lazy(() => import("./modules/dashboard/ProfilePage"));
const SettingsPage = lazy(() => import("./modules/dashboard/SettingsPage"));
const DashboardPage = lazy(() => import("./modules/dashboard/DashboardPage"));

// Lazy load error pages
const NotFound = lazy(() => import("./modules/shared/error/NotFound"));

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
      {/* Public Angelica Life Plan Form - no auth required */}
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
        {/* Dashboard routes */}
        <Route 
          path={`${DASHBOARD_ROOT.client}/*`} 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AngelicaPage />
            </Suspense>
          } 
        />
        <Route 
          path={buildDashboardPath("client", DASHBOARD_SEGMENTS.PROFILE)} 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ProfilePage />
            </Suspense>
          } 
        />
        <Route 
          path={buildDashboardPath("client", DASHBOARD_SEGMENTS.SETTINGS)} 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <SettingsPage />
            </Suspense>
          } 
        />
        {/* Sales Counselor routes */}
        <Route 
          path={buildDashboardPath("sales", DASHBOARD_SEGMENTS.DASHBOARD)} 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <DashboardPage />
            </Suspense>
          } 
        />
        <Route 
          path={`${DASHBOARD_ROOT.sales}/*`} 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AngelicaPage />
            </Suspense>
          } 
        />
        <Route 
          path={buildDashboardPath("sales", DASHBOARD_SEGMENTS.PROFILE)} 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ProfilePage />
            </Suspense>
          } 
        />
        <Route 
          path={buildDashboardPath("sales", DASHBOARD_SEGMENTS.SETTINGS)} 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <SettingsPage />
            </Suspense>
          } 
        />
        {/* Admin routes */}
        <Route 
          path={buildDashboardPath("admin", DASHBOARD_SEGMENTS.DASHBOARD)} 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <DashboardPage />
            </Suspense>
          } 
        />
        <Route 
          path={`${DASHBOARD_ROOT.admin}/*`} 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AngelicaPage />
            </Suspense>
          } 
        />
        <Route 
          path={buildDashboardPath("admin", DASHBOARD_SEGMENTS.PROFILE)} 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ProfilePage />
            </Suspense>
          } 
        />
        <Route 
          path={buildDashboardPath("admin", DASHBOARD_SEGMENTS.SETTINGS)} 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <SettingsPage />
            </Suspense>
          } 
        />
      </Route>
      
      {/* 404 Not Found - catch all unmatched routes */}
      <Route 
        path="*" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </Suspense>
        } 
      />
    </Routes>
  );
};

export default AppRoute;