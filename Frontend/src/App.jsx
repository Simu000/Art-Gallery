import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Artists from "./Components/Artists";
import ArtistDetail from "./Components/ArtistDetail";
import Artifacts from "./Components/Artifacts";
import ArtifactDetail from "./Components/ArtifactDetail";
import Exhibitions from "./Components/Exhibitions";
import ExhibitionDetail from "./Components/ExhibitionDetail";
import UsersPage from "./Components/UsersPage";

export default function App() {
  return (
    <>
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
    </>
  );
}
