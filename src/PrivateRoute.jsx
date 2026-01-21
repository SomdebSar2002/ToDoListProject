import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function PrivateRoute() {
    const { session, authReady } = useAuth();
    if (!authReady) return null;
    return session ? <Outlet /> : <Navigate to="/signin" replace />;
}
