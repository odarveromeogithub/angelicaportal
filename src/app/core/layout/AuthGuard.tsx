import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const AuthGuard = () => {
    const { token } = useAuth();
    const location = useLocation();

    const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
    const isPublicPage = publicRoutes.some((path) => location.pathname.startsWith(path));

    // if not public and no token → redirect to login
    if (!isPublicPage && !token) {
        return <Navigate to="/login" replace />;
    }

    // if already logged in and trying to access public routes → redirect to dashboard
    if (isPublicPage && token) {
        return <Navigate to="/dashboard" replace />;
    }

    // else render nested route content
    return <Outlet />;
};

export default AuthGuard;