import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ElvaLogo from '../Components/ElvaLogo';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use hardcoded credentials directly
    const success = login("admin", "admin");
    if (success) {
      navigate('/app/projects');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1e2c3d] px-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="mb-12">
          <ElvaLogo className="w-72 mx-auto" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm text-white mb-2 uppercase tracking-wider font-medium">
              Username
            </label>
            <input
              type="text"
              value="admin"
              disabled
              className="w-full bg-transparent border-b border-gray-400 px-0 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white [&::placeholder]:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm text-white mb-2 uppercase tracking-wider font-medium">
              Password
            </label>
            <input
              type="password"
              value="admin"
              disabled
              className="w-full bg-transparent border-b border-gray-400 px-0 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white [&::placeholder]:text-gray-400"
            />
          </div>

          <div className="pt-8">
            <button
              type="submit"
              className="w-full bg-white hover:bg-gray-100 text-[#1e2c3d] py-3 rounded-md transition-colors font-semibold"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
