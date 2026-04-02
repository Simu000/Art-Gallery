// App.jsx
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Artists from './pages/Artists'
import ArtistDetail from './pages/ArtistDetail'
import Artifacts from './pages/Artifacts'
import ArtifactDetail from './pages/ArtifactDetail'
import Exhibitions from './pages/Exhibitions'
import ExhibitionDetail from './pages/ExhibitionDetail'
import UsersPage from './pages/UsersPage'

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/"                  element={<Home />} />
        <Route path="/artists"           element={<Artists />} />
        <Route path="/artists/:id"       element={<ArtistDetail />} />
        <Route path="/artifacts"         element={<Artifacts />} />
        <Route path="/artifacts/:id"     element={<ArtifactDetail />} />
        <Route path="/exhibitions"       element={<Exhibitions />} />
        <Route path="/exhibitions/:id"   element={<ExhibitionDetail />} />
        <Route path="/community"         element={<UsersPage />} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}