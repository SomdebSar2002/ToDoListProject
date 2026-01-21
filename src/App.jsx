import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./SingUp";
import SignIn from "./SignIn";
import AuthProvider from "./AuthProvider";
import { Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import PrivateRoute from "./PrivateRoute";
import RouteRedirect from "./RouteRedirect";
export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <RouteRedirect>
                                <Navigate to="/signin" replace />
                            </RouteRedirect>
                        }
                    />
                    <Route path="/signup" element={<RouteRedirect><Signup /></RouteRedirect>} />
                    <Route path="/signin" element={<RouteRedirect><SignIn /></RouteRedirect>} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}