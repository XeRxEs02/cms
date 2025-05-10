import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import elvalogo from "../Images/elva-logo-1.png";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@sbpatil.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/app/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simple validation
    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    // Simulate API call with a timeout
    setTimeout(() => {
      const loginSuccess = login(email, password);

      if (loginSuccess) {
        navigate("/app/dashboard");
      } else {
        setError("Invalid credentials. Please use admin@sbpatil.com / admin123");
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <div
      className="bg-gradient-to-b from-gray-800 to-gray-600 min-h-screen flex items-center justify-center relative px-4"
    //   style={{
    //     background:
    //       "linear-gradient(180deg, rgba(5,0,43,1) 0%, rgba(4,4,143,1) 53%, rgba(30,100,186,1) 98%)",
    //   }}
    >
      <div className="w-full max-w-md text-center bg-transparent p-4 rounded">
        <div className="flex justify-center items-center">
          {" "}
          <img src={elvalogo} alt="Logo" className="w-56 h-30 mb-8" />
        </div>

        <form className="space-y-6 mb-8" onSubmit={handleSubmit}>
          <div className="text-left">
            <label htmlFor="email" className="block text-gray-400 text-sm mb-2">
              EMAIL ADDRESS
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-gray-400 text-white text-lg focus:outline-none"
              required
            />
          </div>

          <div className="text-left">
            <label
              htmlFor="password"
              className="block text-gray-400 text-sm mb-2"
            >
              PASSWORD
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-gray-400 text-white text-lg focus:outline-none"
                required
              />
              <button
                type="button"
                className="absolute right-0 top-0 mt-2 text-gray-400 hover:text-white"
              >
                <i className="fas fa-question-circle"></i>
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-gray-500 hover:bg-gray-600'} text-white py-2 rounded transition flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
