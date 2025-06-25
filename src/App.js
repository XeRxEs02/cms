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
import { ClientProvider } from './context/ClientContext';

const Login = lazy(() => import("./Pages/Login.js"));

// ErrorBoundary for catching lazy load errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // You can log error info here if needed
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: 'red', textAlign: 'center' }}>
          <h2>Something went wrong while loading this page.</h2>
          <pre>{this.state.error?.message || String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

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
              ClientProvider,
              null,
              React.createElement(
                Router,
                null,
                React.createElement(LoadingBar, null),
                React.createElement(
                  AnimatePresence,
                  { mode: "wait" },
                  React.createElement(
                    ErrorBoundary,
                    null,
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
      )
    )
  );
}

export default App;
