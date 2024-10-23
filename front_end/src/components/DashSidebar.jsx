import React, { useState, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiChartPie,
} from "react-icons/hi";
import { LiaCommentSolid } from "react-icons/lia";

import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentuser } = useSelector((store) => store.user);

  const [tab, setTab] = useState("");
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        dispatch(signoutSuccess());
      } else {
        console.log(data.msg);
      }
    } catch (error) {}
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setTab(urlParams?.get("tab"));
  }, [location.search]);
  return (
    <Sidebar className="w-full md:w-56 ">
      <Sidebar.ItemGroup className="flex flex-col gap-1 ">
        {currentuser && currentuser.isAdmin && (
          <Link to="/dashboard?tab=dashboard">
            <Sidebar.Item
              active={tab == "dashboard"}
              icon={HiChartPie}
              as="div"
              className="font-medium"
            >
              Dashboard
            </Sidebar.Item>
          </Link>
        )}
        <Link to="/dashboard?tab=profile">
          <Sidebar.Item
            active={tab == "profile"}
            icon={HiUser}
            label={currentuser.isAdmin ? "Admin" : "User"}
            labelColor="dark"
            as="div"
            className="font-medium"
          >
            Profile
          </Sidebar.Item>
        </Link>
        {currentuser.isAdmin && (
          <Link to="/dashboard?tab=posts">
            <Sidebar.Item
              active={tab == "posts"}
              icon={HiDocumentText}
              labelColor="dark"
              as="div"
              className="font-medium"
            >
              Posts
            </Sidebar.Item>
          </Link>
        )}
        {currentuser.isAdmin && (
          <Link to="/dashboard?tab=users">
            <Sidebar.Item
              active={tab == "users"}
              icon={HiOutlineUserGroup}
              labelColor="dark"
              as="div"
              className="font-medium"
            >
              Users
            </Sidebar.Item>
          </Link>
        )}
        {currentuser.isAdmin && (
          <Link to="/dashboard?tab=comments">
            <Sidebar.Item
              active={tab == "comments"}
              icon={LiaCommentSolid}
              labelColor="dark"
              as="div"
              className="font-medium"
            >
              Comments
            </Sidebar.Item>
          </Link>
        )}
        <Sidebar.Item
          icon={HiArrowSmRight}
          className="cursor-pointer font-medium"
          onClick={handleSignout}
        >
          Sign Out
        </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar>
  );
}
