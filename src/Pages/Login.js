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
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const loginSuccess = login(email, password);

      if (loginSuccess) {
        navigate("/app/projects");
      } else {
        setError("Invalid credentials. Please use admin@sbpatil.com / admin123");
      }

      setIsLoading(false);
    }, 1000);
  };

  return React.createElement(
    'div',
    {
      className: "min-h-screen flex items-center justify-center relative px-4 sm:px-6 lg:px-8",
      style: {
        background: "linear-gradient(135deg, #1e90ff 0%, #00bcd4 100%)",
      }
    },
    React.createElement(
      'div',
      { className: "w-full max-w-sm sm:max-w-md text-center bg-transparent p-4 sm:p-6 rounded" },
      React.createElement(
        'div',
        { className: "flex justify-center items-center mb-8" },
        React.createElement('img', {
          src: elvalogo,
          alt: "Elva Tech",
          className: "w-32 sm:w-40 h-auto"
        })
      ),
      React.createElement(
        'form',
        {
          className: "space-y-6 mb-8",
          onSubmit: handleSubmit
        },
        React.createElement(
          'div',
          null,
          React.createElement('input', {
            id: "email",
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "Username",
            className: "w-full bg-white/90 backdrop-blur-sm border-0 rounded-full px-6 py-4 text-gray-700 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all shadow-lg",
            required: true,
            autoComplete: "email"
          })
        ),
        React.createElement(
          'div',
          null,
          React.createElement('input', {
            id: "password",
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: "Password",
            className: "w-full bg-white/90 backdrop-blur-sm border-0 rounded-full px-6 py-4 text-gray-700 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all shadow-lg",
            required: true,
            autoComplete: "current-password"
          })
        ),
        error && React.createElement(
          'div',
          {
            className: "text-white text-sm text-center mb-4 p-3 bg-red-500/20 rounded-lg border border-red-300/30 backdrop-blur-sm"
          },
          error
        ),
        React.createElement(
          'button',
          {
            type: "submit",
            disabled: isLoading,
            className: `w-full ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
            } text-white py-4 rounded-full transition-all flex items-center justify-center text-base font-semibold shadow-lg transform hover:scale-105 active:scale-95`
          },
          isLoading
            ? React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  'div',
                  {
                    className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                  }
                ),
                "Logging in..."
              )
            : "Login"
        )
      )
    )
  );
}
