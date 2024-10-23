import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { toggleTheme } from "../redux/theme/themeSlice";
export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentuser } = useSelector((store) => store.user);
  const [searchTerm, setSearchterm] = useState("");
  const { theme } = useSelector((store) => store.theme);
  console.log(searchTerm);
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        dispatch(signoutSuccess());
      } else {
      }
    } catch (error) {}
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) setSearchterm(searchTermFromUrl);
  }, [location.search]);
  return (
    <>
      <Navbar className="border-b-2">
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm font-semibold sm:text-xl dark:text-white"
        >
          <span className="bg-gradient-to-r px-2 py-1 mr-1 sm:mr-2  text-white rounded-lg from-indigo-500 via-purple-500 to-pink-500">
            Mohib's
          </span>
          Blog
        </Link>
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
            value={searchTerm}
            onChange={(e) => setSearchterm(e.target.value)}
          ></TextInput>
        </form>
        <Button className="w-12 h-10 lg:hidden" color="gray">
          <AiOutlineSearch />
        </Button>
        <div className="flex gap-2 md:order-2">
          <Button
            className=""
            color="grey"
            pill
            onClick={() => dispatch(toggleTheme())}
          >
            {theme == "light" ? <FaMoon /> : <FaSun />}
          </Button>

          {currentuser ? (
            <>
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar img={currentuser.photoUrl} rounded className="w-9" />
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">{currentuser.username}</span>
                  <span className="font-semibold truncate text-sm">
                    {currentuser.email}
                  </span>
                </Dropdown.Header>
                <Link to="/dashboard?tab=profile">
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
              </Dropdown>
            </>
          ) : (
            <Link to="/sign-in">
              <Button outline gradientDuoTone="purpleToBlue">
                Signin
              </Button>
            </Link>
          )}
        </div>
        <Navbar.Toggle />

        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
            <Link to="/">Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={"div"}>
            <Link to="/about">About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/projects"} as={"div"}>
            <Link to="/projects">Projects</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
