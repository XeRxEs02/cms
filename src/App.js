import React, { lazy, Suspense } from "react";
import Layout from "./containers/Layout";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectContext";
import { ToastProvider } from "./context/ToastContext";
import { LabourProvider } from "./context/LabourContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AppProvider } from './context/AppContext';
import LoadingSpinner from './Components/common/LoadingSpinner';
import { LoadingBar } from './Components/common/LoadingSpinner';
import { AnimatePresence } from 'framer-motion';

const Login = lazy(() => import("./Pages/Login.js"));

function App() {
  return React.createElement(
    AppProvider,
    null,
    React.createElement(
      AuthProvider,
      null,
      React.createElement(
        ProjectProvider,
        null,
        React.createElement(
          LabourProvider,
          null,
          React.createElement(
            ToastProvider,
            null,
            React.createElement(
              Router,
              null,
              React.createElement(LoadingBar, null),
              React.createElement(
                AnimatePresence,
                { mode: "wait" },
                React.createElement(
                  Suspense,
                  { fallback: React.createElement(LoadingSpinner) },
                  React.createElement(
                    Routes,
                    null,
                    React.createElement(Route, {
                      path: "/login",
                      element: React.createElement(Login)
                    }),
                    React.createElement(Route, {
                      path: "/",
                      element: React.createElement(Navigate, { to: "/login", replace: true })
                    }),
                    React.createElement(Route, {
                      path: "/app/*",
                      element: React.createElement(
                        ProtectedRoute,
                        null,
                        React.createElement(Layout)
                      )
                    }),
                    React.createElement(Route, {
                      path: "*",
                      element: React.createElement(Navigate, { to: "/login", replace: true })
                    })
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}

export default App;
