import React, { useState } from "react";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Oauth from "../components/Oauth";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error: errMessage, loading } = useSelector((store) => store.user);
  const [formData, setFormData] = useState({});

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields!"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const response = await res.json();

      if (response.success === false) {
        setTimeout(() => {
          dispatch(signInFailure(response.msg));
        }, 1000);
        return;
      }

      if (res.ok) {
        dispatch(signInSuccess(response));
        navigate("/");
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  }

  return (
    <div className="mt-20 min-h-screen overflow-y-hidden ">
      <div className="flex mx-auto p-3 sm:items-center flex-col max-w-3xl sm:flex-row gap-5">
        <div className="flex-1">
          <div className=" whitespace-nowrap  font-semibold text-4xl dark:text-white">
            <span className="bg-gradient-to-r px-2 py-1 mr-1 sm:mr-2  text-white rounded-lg from-indigo-500 via-purple-500 to-pink-500">
              Mohib's
            </span>
            Blog
          </div>
          <p className="mt-5 text-sm">
            This is a Blogging website. Sign in with your email aur password or
            with Google
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
            <div>
              <Label value="Your Email" className="font-bold" />
              <TextInput
                type="email"
                placeholder="someone@example.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Password" className="font-bold" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">
              {loading ? <Spinner /> : "Signin"}
            </Button>
            <Oauth />
          </form>
          <div className="mt-5 text-sm flex gap-2">
            <span>Donot have an account?</span>
            <Link to="/sign-up" className="text-blue-500 hover:text-blue-800">
              Sign up
            </Link>
          </div>
          {errMessage && (
            <div className="mt-5">
              <Alert color="failure">{errMessage}</Alert>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
