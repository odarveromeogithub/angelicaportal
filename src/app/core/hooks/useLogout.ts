import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/core/context/useAuth";
import { useAppDispatch } from "@/app/core/state/hooks";
import { logout, clearUser } from "@/app/core/state/reducer/auth";
import { APP_ROUTES } from "@/app/core/constants/routes";

/**
 * Custom hook for handling logout across all landing pages
 */
export function useLogout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { logout: authLogout } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    authLogout();
    navigate(APP_ROUTES.LOGIN);
  };

  return handleLogout;
}
