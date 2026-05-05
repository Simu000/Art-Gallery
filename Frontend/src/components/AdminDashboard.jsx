// Components/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { artifactsApi, artistsApi, exhibitionsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('artifacts');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [artists, setArtists] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    medium: '',
    yearCreated: '',
    artistId: '',
    file: null
  });
  
  const [exhibitionForm, setExhibitionForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    artifactIds: [],
    file: null
  });
  
  const [artistForm, setArtistForm] = useState({
    firstName: '',
    lastName: '',
    country: 'Australia',
    bio: '',
    birthYear: '',
    file: null
  });
  
  const [allArtifacts, setAllArtifacts] = useState([]);
  const [allExhibitions, setAllExhibitions] = useState([]);
  const [allArtistsList, setAllArtistsList] = useState([]);
  
  // Edit mode states
  const [editingArtifact, setEditingArtifact] = useState(null);
  const [editingArtist, setEditingArtist] = useState(null);
  const [editingExhibition, setEditingExhibition] = useState(null);
  
  // Check if user is admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'Admin')) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);
  
  // Load data for dropdowns
  useEffect(() => {
    if (user?.role === 'Admin') {
      loadArtists();
      loadArtifacts();
      loadExhibitions();
      loadAllArtists();
    }
  }, [user]);
  
  const loadArtists = async () => {
    try {
      const data = await artistsApi.getAll();
      setArtists(data || []);
    } catch (err) {
      console.error('Failed to load artists:', err);
    }
  };
  
  const loadArtifacts = async () => {
    try {
      const data = await artifactsApi.getAll();
      setAllArtifacts(data || []);
    } catch (err) {
      console.error('Failed to load artifacts:', err);
    }
  };
  
  const loadExhibitions = async () => {
    try {
      const data = await exhibitionsApi.getAll();
      setAllExhibitions(data || []);
    } catch (err) {
      console.error('Failed to load exhibitions:', err);
    }
  };
  
  const loadAllArtists = async () => {
    try {
      const data = await artistsApi.getAll();
      setAllArtistsList(data || []);
    } catch (err) {
      console.error('Failed to load artists:', err);
    }
  };
  
  const handleArtifactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleArtifactFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };
  
  const handleArtistChange = (e) => {
    const { name, value } = e.target;
    setArtistForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleArtistFileChange = (e) => {
    setArtistForm(prev => ({ ...prev, file: e.target.files[0] }));
  };
  
  const handleExhibitionChange = (e) => {
    const { name, value } = e.target;
    setExhibitionForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleExhibitionFileChange = (e) => {
    setExhibitionForm(prev => ({ ...prev, file: e.target.files[0] }));
  };
  
  // ========== ARTIFACT CREATE ==========
  const handleArtifactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await artifactsApi.create({
        title: formData.title,
        description: formData.description,
        medium: formData.medium,
        yearCreated: formData.yearCreated ? parseInt(formData.yearCreated) : null,
        artistId: formData.artistId ? parseInt(formData.artistId) : null,
        file: formData.file
      });
      
      setSuccess('Artifact uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        medium: '',
        yearCreated: '',
        artistId: '',
        file: null
      });
      document.getElementById('artifact-file').value = '';
      loadArtifacts();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to upload artifact');
    } finally {
      setLoading(false);
    }
  };
  
  // ========== ARTIFACT UPDATE ==========
  const startEditArtifact = (artifact) => {
    setEditingArtifact(artifact);
    setFormData({
      title: artifact.title || '',
      description: artifact.description || '',
      medium: artifact.medium || '',
      yearCreated: artifact.yearCreated || '',
      artistId: artifact.artistId || '',
      file: null
    });
    setActiveTab('artifacts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEditArtifact = () => {
    setEditingArtifact(null);
    setFormData({
      title: '',
      description: '',
      medium: '',
      yearCreated: '',
      artistId: '',
      file: null
    });
    document.getElementById('artifact-file').value = '';
  };
  
  const handleArtifactUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await artifactsApi.update(editingArtifact.id, {
        title: formData.title,
        description: formData.description,
        medium: formData.medium,
        yearCreated: formData.yearCreated ? parseInt(formData.yearCreated) : null,
        artistId: formData.artistId ? parseInt(formData.artistId) : null,
        file: formData.file
      });
      
      setSuccess('Artifact updated successfully!');
      setEditingArtifact(null);
      setFormData({
        title: '',
        description: '',
        medium: '',
        yearCreated: '',
        artistId: '',
        file: null
      });
      document.getElementById('artifact-file').value = '';
      loadArtifacts();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update artifact');
    } finally {
      setLoading(false);
    }
  };
  
  // ========== ARTIST CREATE ==========
  const handleArtistSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await artistsApi.create({
        firstName: artistForm.firstName,
        lastName: artistForm.lastName,
        country: artistForm.country,
        bio: artistForm.bio,
        birthYear: artistForm.birthYear ? parseInt(artistForm.birthYear) : null,
        file: artistForm.file
      });
      
      setSuccess('Artist added successfully!');
      setArtistForm({
        firstName: '',
        lastName: '',
        country: 'Australia',
        bio: '',
        birthYear: '',
        file: null
      });
      document.getElementById('artist-file').value = '';
      loadArtists();
      loadAllArtists();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to add artist');
    } finally {
      setLoading(false);
    }
  };
  
  // ========== ARTIST UPDATE ==========
  const startEditArtist = (artist) => {
    setEditingArtist(artist);
    setArtistForm({
      firstName: artist.firstName || '',
      lastName: artist.lastName || '',
      country: artist.country || 'Australia',
      bio: artist.bio || '',
      birthYear: artist.birthYear || '',
      file: null
    });
    setActiveTab('artists');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEditArtist = () => {
    setEditingArtist(null);
    setArtistForm({
      firstName: '',
      lastName: '',
      country: 'Australia',
      bio: '',
      birthYear: '',
      file: null
    });
    document.getElementById('artist-file').value = '';
  };
  
  const handleArtistUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await artistsApi.update(editingArtist.id, {
        firstName: artistForm.firstName,
        lastName: artistForm.lastName,
        country: artistForm.country,
        bio: artistForm.bio,
        birthYear: artistForm.birthYear ? parseInt(artistForm.birthYear) : null,
        file: artistForm.file
      });
      
      setSuccess('Artist updated successfully!');
      setEditingArtist(null);
      setArtistForm({
        firstName: '',
        lastName: '',
        country: 'Australia',
        bio: '',
        birthYear: '',
        file: null
      });
      document.getElementById('artist-file').value = '';
      loadArtists();
      loadAllArtists();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update artist');
    } finally {
      setLoading(false);
    }
  };
  
  // ========== EXHIBITION CREATE ==========
  const handleExhibitionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await exhibitionsApi.create({
        name: exhibitionForm.name,
        description: exhibitionForm.description,
        startDate: exhibitionForm.startDate,
        endDate: exhibitionForm.endDate,
        location: exhibitionForm.location,
        artifactIds: exhibitionForm.artifactIds.map(id => parseInt(id)),
        file: exhibitionForm.file
      });
      
      setSuccess('Exhibition created successfully!');
      setExhibitionForm({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        artifactIds: [],
        file: null
      });
      document.getElementById('exhibition-file').value = '';
      loadExhibitions();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create exhibition');
    } finally {
      setLoading(false);
    }
  };
  
  // ========== EXHIBITION UPDATE ==========
  const startEditExhibition = async (exhibition) => {
    // Fetch full exhibition details with artifact IDs
    try {
      const fullExhibition = await exhibitionsApi.getById(exhibition.id);
      setEditingExhibition(fullExhibition);
      setExhibitionForm({
        name: fullExhibition.name || '',
        description: fullExhibition.description || '',
        startDate: fullExhibition.startDate ? fullExhibition.startDate.split('T')[0] : '',
        endDate: fullExhibition.endDate ? fullExhibition.endDate.split('T')[0] : '',
        location: fullExhibition.location || '',
        artifactIds: fullExhibition.artifactIds || [],
        file: null
      });
      setActiveTab('exhibitions');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Failed to load exhibition details');
    }
  };
  
  const cancelEditExhibition = () => {
    setEditingExhibition(null);
    setExhibitionForm({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      artifactIds: [],
      file: null
    });
    document.getElementById('exhibition-file').value = '';
  };
  
  const handleExhibitionUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await exhibitionsApi.update(editingExhibition.id, {
        name: exhibitionForm.name,
        description: exhibitionForm.description,
        startDate: exhibitionForm.startDate,
        endDate: exhibitionForm.endDate,
        location: exhibitionForm.location,
        artifactIds: exhibitionForm.artifactIds.map(id => parseInt(id)),
        file: exhibitionForm.file
      });
      
      setSuccess('Exhibition updated successfully!');
      setEditingExhibition(null);
      setExhibitionForm({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        artifactIds: [],
        file: null
      });
      document.getElementById('exhibition-file').value = '';
      loadExhibitions();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update exhibition');
    } finally {
      setLoading(false);
    }
  };
  
  // ========== DELETE FUNCTIONS ==========
  const handleDeleteArtifact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this artifact?')) return;
    try {
      await artifactsApi.delete(id);
      setSuccess('Artifact deleted successfully');
      loadArtifacts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete artifact');
    }
  };
  
  const handleDeleteArtist = async (id) => {
    if (!window.confirm('Are you sure you want to delete this artist?')) return;
    try {
      await artistsApi.delete(id);
      setSuccess('Artist deleted successfully');
      loadArtists();
      loadAllArtists();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete artist');
    }
  };
  
  const handleDeleteExhibition = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exhibition?')) return;
    try {
      await exhibitionsApi.delete(id);
      setSuccess('Exhibition deleted successfully');
      loadExhibitions();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete exhibition');
    }
  };
  
  if (authLoading) return <LoadingSpinner message="Loading..." />;
  if (!user || user.role !== 'Admin') return null;
  
  return (
    <main className="admin-dashboard">
      <div className="page-hero-thin">
        <div className="page-container">
          <span className="section-label fade-up">Admin Panel</span>
          <h1 className="page-hero-thin__title fade-up delay-1">
            Dashboard<br /><em>Manage Gallery</em>
          </h1>
          <p className="page-hero-thin__desc fade-up delay-2">
            Welcome back, {user.firstName}. Upload new artifacts, manage artists, and curate exhibitions.
          </p>
        </div>
      </div>
      
      <div className="page-container">
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'artifacts' ? 'active' : ''}`}
            onClick={() => { setActiveTab('artifacts'); cancelEditArtifact(); }}
          >
            Upload Artifact
          </button>
          <button 
            className={`admin-tab ${activeTab === 'artists' ? 'active' : ''}`}
            onClick={() => { setActiveTab('artists'); cancelEditArtist(); }}
          >
            Add Artist
          </button>
          <button 
            className={`admin-tab ${activeTab === 'exhibitions' ? 'active' : ''}`}
            onClick={() => { setActiveTab('exhibitions'); cancelEditExhibition(); }}
          >
            Create Exhibition
          </button>
          <button 
            className={`admin-tab ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            Manage Items
          </button>
        </div>
        
        {error && <ErrorMessage message={error} onRetry={() => setError('')} />}
        {success && <div className="admin-success">{success}</div>}
        
        {/* Upload/Edit Artifact Tab */}
        {activeTab === 'artifacts' && (
          <div className="admin-form-container">
            <h2 className="admin-form-title">
              {editingArtifact ? 'Edit Artifact' : 'Upload New Artifact'}
            </h2>
            <form onSubmit={editingArtifact ? handleArtifactUpdate : handleArtifactSubmit} className="admin-form">
              <div className="admin-form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleArtifactChange}
                  required
                  placeholder="e.g., Dreamtime Serpent"
                />
              </div>
              
              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleArtifactChange}
                  rows={4}
                  placeholder="Describe the artwork..."
                />
              </div>
              
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Medium</label>
                  <input
                    type="text"
                    name="medium"
                    value={formData.medium}
                    onChange={handleArtifactChange}
                    placeholder="e.g., Acrylic on canvas"
                  />
                </div>
                
                <div className="admin-form-group">
                  <label>Year Created</label>
                  <input
                    type="number"
                    name="yearCreated"
                    value={formData.yearCreated}
                    onChange={handleArtifactChange}
                    placeholder="e.g., 2024"
                  />
                </div>
              </div>
              
              <div className="admin-form-group">
                <label>Artist (Optional)</label>
                <select
                  name="artistId"
                  value={formData.artistId}
                  onChange={handleArtifactChange}
                >
                  <option value="">-- Select Artist --</option>
                  {artists.map(artist => (
                    <option key={artist.id} value={artist.id}>
                      {artist.firstName} {artist.lastName} ({artist.country})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="admin-form-group">
                <label>Artwork Image {editingArtifact && '(Leave empty to keep current image)'}</label>
                <input
                  type="file"
                  id="artifact-file"
                  accept="image/*"
                  onChange={handleArtifactFileChange}
                />
                <small>Max 5MB. JPG, PNG, or GIF</small>
              </div>
              
              <div className="admin-form-actions">
                <button type="submit" className="admin-submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingArtifact ? 'Update Artifact' : 'Upload Artifact')}
                </button>
                {editingArtifact && (
                  <button type="button" className="admin-cancel" onClick={cancelEditArtifact}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
        
        {/* Add/Edit Artist Tab */}
        {activeTab === 'artists' && (
          <div className="admin-form-container">
            <h2 className="admin-form-title">
              {editingArtist ? 'Edit Artist' : 'Add New Artist'}
            </h2>
            <form onSubmit={editingArtist ? handleArtistUpdate : handleArtistSubmit} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={artistForm.firstName}
                    onChange={handleArtistChange}
                    required
                  />
                </div>
                
                <div className="admin-form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={artistForm.lastName}
                    onChange={handleArtistChange}
                  />
                </div>
              </div>
              
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={artistForm.country}
                    onChange={handleArtistChange}
                    placeholder="e.g., Australia"
                  />
                </div>
                
                <div className="admin-form-group">
                  <label>Birth Year</label>
                  <input
                    type="number"
                    name="birthYear"
                    value={artistForm.birthYear}
                    onChange={handleArtistChange}
                    placeholder="e.g., 1950"
                  />
                </div>
              </div>
              
              <div className="admin-form-group">
                <label>Biography</label>
                <textarea
                  name="bio"
                  value={artistForm.bio}
                  onChange={handleArtistChange}
                  rows={4}
                  placeholder="Artist's background, style, and significance..."
                />
              </div>
              
              <div className="admin-form-group">
                <label>Artist Photo {editingArtist && '(Leave empty to keep current photo)'}</label>
                <input
                  type="file"
                  id="artist-file"
                  accept="image/*"
                  onChange={handleArtistFileChange}
                />
                <small>Max 5MB. JPG, PNG, or GIF</small>
              </div>
              
              <div className="admin-form-actions">
                <button type="submit" className="admin-submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingArtist ? 'Update Artist' : 'Add Artist')}
                </button>
                {editingArtist && (
                  <button type="button" className="admin-cancel" onClick={cancelEditArtist}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
        
        {/* Create/Edit Exhibition Tab */}
        {activeTab === 'exhibitions' && (
          <div className="admin-form-container">
            <h2 className="admin-form-title">
              {editingExhibition ? 'Edit Exhibition' : 'Create New Exhibition'}
            </h2>
            <form onSubmit={editingExhibition ? handleExhibitionUpdate : handleExhibitionSubmit} className="admin-form">
              <div className="admin-form-group">
                <label>Exhibition Name *</label>
                <input
                  type="text"
                  name="name"
                  value={exhibitionForm.name}
                  onChange={handleExhibitionChange}
                  required
                />
              </div>
              
              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={exhibitionForm.description}
                  onChange={handleExhibitionChange}
                  rows={3}
                />
              </div>
              
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={exhibitionForm.startDate}
                    onChange={handleExhibitionChange}
                  />
                </div>
                
                <div className="admin-form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={exhibitionForm.endDate}
                    onChange={handleExhibitionChange}
                  />
                </div>
              </div>
              
              <div className="admin-form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={exhibitionForm.location}
                  onChange={handleExhibitionChange}
                  placeholder="e.g., Main Gallery, Sydney"
                />
              </div>
              
              <div className="admin-form-group">
                <label>Artifacts in Exhibition</label>
                <select
                  multiple
                  name="artifactIds"
                  value={exhibitionForm.artifactIds}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                    setExhibitionForm(prev => ({ ...prev, artifactIds: selected }));
                  }}
                  style={{ minHeight: '150px' }}
                >
                  {allArtifacts.map(artifact => (
                    <option key={artifact.id} value={artifact.id}>
                      {artifact.title} ({artifact.yearCreated || 'Year unknown'})
                    </option>
                  ))}
                </select>
                <small>Hold Ctrl/Cmd to select multiple artifacts</small>
              </div>
              
              <div className="admin-form-group">
                <label>Cover Image {editingExhibition && '(Leave empty to keep current image)'}</label>
                <input
                  type="file"
                  id="exhibition-file"
                  accept="image/*"
                  onChange={handleExhibitionFileChange}
                />
              </div>
              
              <div className="admin-form-actions">
                <button type="submit" className="admin-submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingExhibition ? 'Update Exhibition' : 'Create Exhibition')}
                </button>
                {editingExhibition && (
                  <button type="button" className="admin-cancel" onClick={cancelEditExhibition}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
        
        {/* Manage Items Tab - Updated with Edit buttons */}
        {activeTab === 'manage' && (
          <div className="admin-manage">
            <div className="admin-manage-section">
              <h3>Artifacts ({allArtifacts.length})</h3>
              <div className="admin-manage-list">
                {allArtifacts.map(artifact => (
                  <div key={artifact.id} className="admin-manage-item">
                    <div className="admin-manage-item-info">
                      <strong>{artifact.title}</strong>
                      <span>{artifact.medium || 'No medium'} · {artifact.yearCreated || 'Year unknown'}</span>
                    </div>
                    <div className="admin-manage-item-actions">
                      <button 
                        onClick={() => startEditArtifact(artifact)}
                        className="admin-edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteArtifact(artifact.id)}
                        className="admin-delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {allArtifacts.length === 0 && <p>No artifacts yet. Upload your first artifact above.</p>}
              </div>
            </div>
            
            <div className="admin-manage-section">
              <h3>Artists ({allArtistsList.length})</h3>
              <div className="admin-manage-list">
                {allArtistsList.map(artist => (
                  <div key={artist.id} className="admin-manage-item">
                    <div className="admin-manage-item-info">
                      <strong>{artist.firstName} {artist.lastName}</strong>
                      <span>{artist.country} · b.{artist.birthYear || 'Unknown'}</span>
                    </div>
                    <div className="admin-manage-item-actions">
                      <button 
                        onClick={() => startEditArtist(artist)}
                        className="admin-edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteArtist(artist.id)}
                        className="admin-delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {allArtistsList.length === 0 && <p>No artists yet. Add your first artist above.</p>}
              </div>
            </div>
            
            <div className="admin-manage-section">
              <h3>Exhibitions ({allExhibitions.length})</h3>
              <div className="admin-manage-list">
                {allExhibitions.map(exhibition => (
                  <div key={exhibition.id} className="admin-manage-item">
                    <div className="admin-manage-item-info">
                      <strong>{exhibition.name}</strong>
                      <span>{exhibition.location || 'No location'} · {exhibition.startDate?.split('T')[0]} to {exhibition.endDate?.split('T')[0]}</span>
                    </div>
                    <div className="admin-manage-item-actions">
                      <button 
                        onClick={() => startEditExhibition(exhibition)}
                        className="admin-edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteExhibition(exhibition.id)}
                        className="admin-delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {allExhibitions.length === 0 && <p>No exhibitions yet. Create your first exhibition above.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}