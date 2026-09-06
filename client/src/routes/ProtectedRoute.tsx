import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

const ProtectedRoute = () => {
  const user = useAppSelector((state) => state.auth.user);
  console.log("ProtectedRoute user:", user);

  if (!user) {
    console.log("🚨 REDIRECTING TO LOGIN");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ ALLOWING DASHBOARD");
  return <Outlet />;
};

export default ProtectedRoute;