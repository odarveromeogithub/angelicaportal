import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { PUBLIC_ROUTES, APP_ROUTES } from "../constants/routes";

const AuthGuard = () => {
    const { token } = useAuth();
    const location = useLocation();

    const isPublicPage = PUBLIC_ROUTES.some((path) => location.pathname.startsWith(path));

    // if not public and no token → redirect to login
    if (!isPublicPage && !token) {
        return <Navigate to={APP_ROUTES.LOGIN} replace />;
    }

    // if already logged in and trying to access public routes → redirect to dashboard
    if (isPublicPage && token) {
        return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
    }

    // else render nested route content
    return <Outlet />;
};

export default AuthGuard;