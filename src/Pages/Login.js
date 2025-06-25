import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ElvaLogo from '../Components/ElvaLogo';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // State for username and password
  const [username, setUsername] = useState("saielva");
  const [password, setPassword] = useState("Tarun@2002");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use entered credentials
    const success = login(username, password);
    if (success) {
      navigate('/app/projects');
    }
  };

  return (
    <div className="min-h-screen bg-[#1e2c3d] px-4 flex flex-col">
      {/* Logo at the very top center */}
      <div className="w-full flex justify-center mt-0 mb-4">
        <ElvaLogo className="w-72" />
      </div>
      {/* Login Form directly below logo */}
      <div className="w-full max-w-md mx-auto mt-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white mb-2 uppercase tracking-wider font-medium">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-gray-400 px-0 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white [&::placeholder]:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm text-white mb-2 uppercase tracking-wider font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-gray-400 px-0 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white [&::placeholder]:text-gray-400"
            />
          </div>

          <div className="pt-4">
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
