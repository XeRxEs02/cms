import React, { lazy } from "react";
import Layout from "./containers/Layout";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const Login = lazy(() => import("./Pages/Login.js"));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* Add Login route */}
        <Route path="/*" element={<Layout />} /> {/* All other routes */}
      </Routes>
    </Router>
  );
}

export default App;
