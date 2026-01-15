import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function PrivateRoute() {
    const { session } = useAuth();
    console.log("PrivateRoute Session: ", session);
    return session ? <Outlet /> : <Navigate to="/signin" replace />;
}
