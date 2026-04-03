import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Artists from "./Components/Artists";
import ArtistDetail from "./Components/Artistdetail";
import Artifacts from "./Components/Artifacts";
import ArtifactDetail from "./Components/Artifactdetail";
import Exhibitions from "./Components/Exhibitions";
import ExhibitionDetail from "./Components/Exhibitiondetail";

import UsersPage from "./Components/UsersPage";
import Contact from "./Components/Contact";

import Welcome from "./Components/Welcome";
import Login from "./Components/Login";
import Signin from "./Components/Signin";

const AUTH_ROUTES = ['/welcome', '/login', '/signin', '/auth/callback']

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/welcome" replace />
  return children
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return children
}

function Layout() {
  const { pathname } = useLocation()
  const isAuthPage = AUTH_ROUTES.includes(pathname)

  return (
    <div className="app-shell">
      {!isAuthPage && <Navbar />}
      <div className="app-main">
        <Routes>
          <Route path="/welcome"        element={<PublicOnlyRoute><Welcome /></PublicOnlyRoute>} />
          <Route path="/login"          element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/signin"         element={<PublicOnlyRoute><Signin /></PublicOnlyRoute>} />
          <Route path="/"               element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/artists"        element={<ProtectedRoute><Artists /></ProtectedRoute>} />
          <Route path="/artists/:id"    element={<ProtectedRoute><ArtistDetail /></ProtectedRoute>} />
          <Route path="/artifacts"      element={<ProtectedRoute><Artifacts /></ProtectedRoute>} />
          <Route path="/artifacts/:id"  element={<ProtectedRoute><ArtifactDetail /></ProtectedRoute>} />
          <Route path="/exhibitions"    element={<ProtectedRoute><Exhibitions /></ProtectedRoute>} />
          <Route path="/exhibitions/:id" element={<ProtectedRoute><ExhibitionDetail /></ProtectedRoute>} />
          <Route path="/community"      element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          <Route path="/contact"        element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!isAuthPage && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}
