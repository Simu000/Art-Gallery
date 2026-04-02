// App.jsx
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:id" element={<ArtistDetail />} />
        <Route path="/artifacts" element={<Artifacts />} />
        <Route path="/artifacts/:id" element={<ArtifactDetail />} />
        <Route path="/exhibitions" element={<Exhibitions />} />
        <Route path="/exhibitions/:id" element={<ExhibitionDetail />} />
        <Route path="/community" element={<UsersPage />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}
