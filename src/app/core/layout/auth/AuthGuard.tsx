import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { PUBLIC_ROUTES, APP_ROUTES } from "../../constants/publicPaths";
import { DASHBOARD_ROOT } from "../../constants/dashboardPaths";
import { selectIsAuthenticated } from "../../state/selector/auth.selector";

export const AuthGuard = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  const isPublicPage = PUBLIC_ROUTES.some((path) =>
    location.pathname.startsWith(path),
  );

  // if not public and no token → redirect to login
  if (!isPublicPage && !isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  // if already logged in and trying to access public routes → redirect to dashboard
  if (isPublicPage && isAuthenticated) {
    return <Navigate to={DASHBOARD_ROOT.client} replace />;
  }

  // else render nested route content
  return <Outlet />;
};

export default AuthGuard;
