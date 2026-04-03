// App.jsx  — UPDATED
// Place this file at: Frontend/src/App.jsx
// Changes from original:
//   1. Added imports for Welcome, Login, Signin Components
//   2. Added import for OAuthCallback from AuthContext
//   3. Added routes: /welcome, /login, /signin, /auth/callback
//   4. Wrapped routes so Navbar/Footer are hidden on auth Components

import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, OAuthCallback } from "./context/AuthContext";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Artists from "./Components/Artists";
import ArtistDetail from "./Components/Artistdetail";
import Artifacts from "./Components/Artifacts";
import ArtifactDetail from "./Components/Artifacts";
import Exhibitions from "./Components/Exhibitions";
import ExhibitionDetail from "./Components/Exhibitiondetail";
import UsersPage from "./Components/UsersPage";

// New auth Components
import Welcome from "./Components/Welcome";
import Login from "./Components/Login";
import Signin from "./Components/Signin";

// Routes where Navbar + Footer should NOT appear
const AUTH_ROUTES = ['/welcome', '/login', '/signin', '/auth/callback']

function Layout() {
  const { pathname } = useLocation()
  const isAuthPage = AUTH_ROUTES.includes(pathname)

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        {/* ── Auth Components (no Navbar/Footer) ─────────────────────────── */}
        <Route path="/welcome"        element={<Welcome />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/signin"         element={<Signin />} />
        <Route path="/auth/callback"  element={<OAuthCallback />} />

        {/* ── Main app Components ────────────────────────────────────────── */}
        <Route path="/"               element={<Home />} />
        <Route path="/artists"        element={<Artists />} />
        <Route path="/artists/:id"    element={<ArtistDetail />} />
        <Route path="/artifacts"      element={<Artifacts />} />
        <Route path="/artifacts/:id"  element={<ArtifactDetail />} />
        <Route path="/exhibitions"    element={<Exhibitions />} />
        <Route path="/exhibitions/:id" element={<ExhibitionDetail />} />
        <Route path="/community"      element={<UsersPage />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}
