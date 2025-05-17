import { lazy, Suspense } from "react";
import Layout from "./containers/Layout";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectContext";
import ProtectedRoute from "./Components/ProtectedRoute";

const Login = lazy(() => import("./Pages/Login.js"));

// Loading component for suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              />

              {/* Redirect root to projects page */}
              <Route path="/" element={<Navigate to="/app/projects" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
