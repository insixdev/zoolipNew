import { useAuth } from "@/features";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login"/>;

  return children;
};

export default PrivateRoute;
