import {BrowserRouter, Routes, Route} from "react-router-dom";
import Signup from "./SingUp";
import SignIn from "./SignIn";
import AuthProvider from "./AuthProvider";
import { Navigate} from "react-router-dom";
import Dashboard from "./Dashboard";
import PrivateRoute from "./PrivateRoute";
export default function App(){
    return(
        <BrowserRouter>
            <AuthProvider>
            <Routes>
                <Route path="/" element={<Navigate to="/signin" replace/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/signin" element={<SignIn/>}/>
                <Route element={<PrivateRoute/>}>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                </Route>
            </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}