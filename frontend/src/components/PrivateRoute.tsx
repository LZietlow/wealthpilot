import { Navigate, Outlet, useLocation } from "react-router-dom";



export function PrivateRoute() {
    const token = localStorage.getItem('token');
    const location = useLocation();

    if(token === null || token === undefined) {
        return <Navigate to={'/login'} state={{from: location}} replace />
    }

    return <Outlet />

}