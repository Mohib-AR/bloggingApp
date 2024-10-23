import React, { useState } from "react";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Oauth from "../components/Oauth";
export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [errMessage, setErrMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrMessage("Please fill out all fields!");
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const response = await res.json();

      if (response.success === false) {
        setTimeout(() => {
          setLoading(false);
          setErrMessage(response.msg);
        }, 1000);
        return;
      }
      setLoading(false);

      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (err) {
      setErrMessage(err.message);
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
            This is a Blogging website. Sign up with your email aur password or
            with Google
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
            <div className="">
              <Label value="Your Username" className="font-bold" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
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
              {loading ? <Spinner /> : "Signup"}
            </Button>
            <Oauth />
          </form>
          <div className="mt-5 text-sm flex gap-2">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500 hover:text-blue-800">
              Sign in
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
