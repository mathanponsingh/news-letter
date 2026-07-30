import { Outlet, Navigate } from "react-router-dom";

export function AuthLayout() {
    const isLoggedIn = false;
    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }
    return (
        <div>
            <Outlet />
        </div>
    );
}