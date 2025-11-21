import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSmartAuth } from "~/features/auth/useSmartAuth";
import { getDashboardRouteByRole } from "~/lib/routeUtils";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useSmartAuth();

  useEffect(() => {
    if (user) {
      // Si el usuario está autenticado, redirigir a su dashboard correspondiente
      const dashboardRoute = getDashboardRouteByRole(user.role);
      navigate(dashboardRoute);
    } else {
      // Si no está autenticado, redirigir a landing
      navigate("/landing");
    }
  }, [user, navigate]);

  return null;
}
