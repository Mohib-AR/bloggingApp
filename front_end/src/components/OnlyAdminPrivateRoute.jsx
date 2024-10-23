import React from "react";
import { useNavigate, Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function OnlyAdminPrivateRoute() {
  const { currentuser } = useSelector((store) => store.user);

  return (
    <>
      {currentuser?.isAdmin && currentuser?.isAdmin ? (
        <Outlet />
      ) : (
        <Navigate to="/sign-in" />
      )}
    </>
  );
}
