// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Landing from "./Components/Landing";
import Home from "./Components/Home";
import Artists from "./Components/Artists";
import ArtistDetail from "./Components/Artistdetail";
import Artifacts from "./Components/Artifacts";
import ArtifactDetail from "./Components/Artifactdetail";
import Exhibitions from "./Components/Exhibitions";
import ExhibitionDetail from "./Components/ExhibitionDetail";
import UsersPage from "./Components/UsersPage";
import Contact from "./Components/Contact";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      {/* Landing page - accessible to everyone */}
      <Route path="/" element={<Landing />} />

      {/* Protected routes - require authentication */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artists"
        element={
          <ProtectedRoute>
            <Artists />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artists/:id"
        element={
          <ProtectedRoute>
            <ArtistDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artifacts"
        element={
          <ProtectedRoute>
            <Artifacts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artifacts/:id"
        element={
          <ProtectedRoute>
            <ArtifactDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exhibitions"
        element={
          <ProtectedRoute>
            <Exhibitions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exhibitions/:id"
        element={
          <ProtectedRoute>
            <ExhibitionDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  const isLandingPage = window.location.pathname === "/";

  return (
    <>
      {user && !isLandingPage && <Navbar />}
      <AppRoutes />
      {user && !isLandingPage && <Footer />}
    </>
  );
}
