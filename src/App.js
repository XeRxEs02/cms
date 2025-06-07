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
import { ToastProvider } from "./context/ToastContext";
import { LabourProvider } from "./context/LabourContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import DailyReport from './Pages/DailyReport';
import { AppProvider } from './context/AppContext';

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
    <AppProvider>
      <AuthProvider>
        <ProjectProvider>
          <LabourProvider>
            <ToastProvider>
              <Router>
                <Suspense fallback={<Loading />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Protected routes - all app routes */}
                    <Route
                      path="/app/*"
                      element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch all unmatched routes */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                  </Routes>
                </Suspense>
              </Router>
            </ToastProvider>
          </LabourProvider>
        </ProjectProvider>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
