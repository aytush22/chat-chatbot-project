import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";

const clientId = "168221201305-gbgg5p307fu9k4allv99842qodudilp1.apps.googleusercontent.com";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    try {
      const res = await axios.post("/users/google-login", { token: response.credential });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  function submitHandler(e) {
    e.preventDefault();
    axios
      .post("/users/login", {
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);
        navigate("/");
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800/90 p-8 rounded-xl shadow-2xl w-full max-w-md backdrop-blur-lg border border-gray-700">
          <h2 className="text-3xl font-extrabold text-white mb-6 text-center">Login</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2" htmlFor="email">
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-sm"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2" htmlFor="password">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-sm"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            >
              Login
            </button>
          </form>

          <div className="my-6 flex items-center justify-center">
            <div className="border-t border-gray-500 w-1/3"></div>
            <span className="text-gray-400 mx-4">OR</span>
            <div className="border-t border-gray-500 w-1/3"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log("Google Login Failed")}
            />
          </div>

          <p className="text-gray-400 mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 transition">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
