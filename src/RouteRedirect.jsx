import {useAuth} from "./AuthProvider";
import { Navigate} from "react-router-dom";

export default function RouteRedirect({children}) {
    const {session} = useAuth();
    if(session)
        return <Navigate to="/dashboard" replace/>;
    return children;
}