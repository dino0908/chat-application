import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute = () => {
    const { user, isCheckingAuth } = useAuthStore()

  if (isCheckingAuth) return <div>Loading...</div>;

  // 'replace' prevents the user from clicking "back" into the protected area
  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;