import React from "react";
import { useNavigate, Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function PrivateRoute() {
  const { currentuser } = useSelector((store) => store.user);
  const navigate = useNavigate();
  return <>{currentuser ? <Outlet /> : <Navigate to="/sign-in" />}</>;
}
