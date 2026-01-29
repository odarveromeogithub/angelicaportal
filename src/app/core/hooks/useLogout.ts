import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/core/state/hooks";
import { logout } from "@/app/core/state/reducer/auth";
import { APP_ROUTES } from "@/app/core/constants/publicPaths";

/**
 * Custom hook for handling logout across all landing pages
 * Now fully Redux-based, no context dependency
 */
export function useLogout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate(APP_ROUTES.LOGIN);
  };

  return handleLogout;
}
