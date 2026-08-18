import { Navigate, Outlet, useLocation } from "react-router";
import { useAccount } from "../../lib/hooks/useAccount"
import { Typography } from "@mui/material";

export default function RequireAuth() {

    const { currentUser, loadingUserInfo } = useAccount();
    const loacation = useLocation();


    if (loadingUserInfo)
        return <Typography>Loading...</Typography>

    if (!currentUser)
        return <Navigate to="/login" state={{ from: loacation }} />

    return (
        <Outlet />
    )
}