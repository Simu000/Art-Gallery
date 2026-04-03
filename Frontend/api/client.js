const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5126'

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  })

  if (!res.ok) {
    let msg = `Request failed: ${res.status} ${res.statusText}`
    try {
      const json = await res.json()
      msg = json.message ?? json.title ?? JSON.stringify(json)
    } catch {
    }
    throw new Error(msg)
  }

  if (res.status === 204) return null

  return res.json()
}

const get  = (path)        => request(path)
const post = (path, body)  => request(path, { method: 'POST',   body: body instanceof FormData ? body : JSON.stringify(body) })
const put  = (path, body)  => request(path, { method: 'PUT',    body: body instanceof FormData ? body : JSON.stringify(body) })
const del  = (path)        => request(path, { method: 'DELETE' })

export const auth = {
  register: (dto) => post('/api/auth/register', dto),

  login: (dto) => post('/api/auth/login', dto),

  verifyOtpRegistration: (dto) => post('/api/auth/verify-otp-registration', dto),

  verifyOtpLogin: (dto) => post('/api/auth/verify-otp-login', dto),

  logout: () => post('/api/auth/logout', {}),
}

export const userApi = {
  me: () => get('/api/user/me'),

  getAll: () => get('/api/user'),

  uploadProfileImage: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return post('/api/user/me/profile-image', fd)
  },
}

export const artistsApi = {
  getAll: () => get('/api/artists'),

  getById: (id) => get(`/api/artists/${id}`),

  create: (dto) => {
    const fd = new FormData()
    fd.append('FirstName', dto.firstName)
    fd.append('LastName',  dto.lastName)
    if (dto.country)   fd.append('Country',   dto.country)
    if (dto.bio)       fd.append('Bio',        dto.bio)
    if (dto.birthYear) fd.append('BirthYear',  dto.birthYear)
    if (dto.file)      fd.append('file',        dto.file)
    return post('/api/artists', fd)
  },

  update: (id, dto) => {
    const fd = new FormData()
    fd.append('FirstName', dto.firstName)
    fd.append('LastName',  dto.lastName)
    if (dto.country)   fd.append('Country',   dto.country)
    if (dto.bio)       fd.append('Bio',        dto.bio)
    if (dto.birthYear) fd.append('BirthYear',  dto.birthYear)
    if (dto.file)      fd.append('file',        dto.file)
    return put(`/api/artists/${id}`, fd)
  },

  delete: (id) => del(`/api/artists/${id}`),
}

export const artifactsApi = {
  getAll: () => get('/api/artifacts'),

  getById: (id) => get(`/api/artifacts/${id}`),

  search: (q) => get(`/api/artifacts/search?q=${encodeURIComponent(q)}`),

  getFacts: () => get('/api/artifacts/facts'),

  create: (dto) => {
    const fd = new FormData()
    fd.append('Title',       dto.title)
    fd.append('Description', dto.description ?? '')
    fd.append('Medium',      dto.medium ?? '')
    fd.append('YearCreated', dto.yearCreated)
    fd.append('ArtistId',    dto.artistId)
    if (dto.file) fd.append('File', dto.file)
    return post('/api/artifacts', fd)
  },

  update: (id, dto) => {
    const fd = new FormData()
    fd.append('Title',       dto.title)
    fd.append('Description', dto.description ?? '')
    fd.append('Medium',      dto.medium ?? '')
    fd.append('YearCreated', dto.yearCreated)
    fd.append('ArtistId',    dto.artistId)
    if (dto.file) fd.append('File', dto.file)
    return put(`/api/artifacts/${id}`, fd)
  },

  delete: (id) => del(`/api/artifacts/${id}`),
}

export const exhibitionsApi = {
  getAll: () => get('/api/exhibitions'),

  getById: (id) => get(`/api/exhibitions/${id}`),

  create: (dto) => {
    const fd = new FormData()
    fd.append('Name',        dto.name)
    fd.append('Description', dto.description ?? '')
    fd.append('StartDate',   dto.startDate)
    fd.append('EndDate',     dto.endDate)
    if (dto.location)    fd.append('Location',    dto.location)
    if (dto.file)        fd.append('File',        dto.file)
    if (dto.artifactIds) dto.artifactIds.forEach(id => fd.append('ArtifactIds', id))
    return post('/api/exhibitions', fd)
  },

  update: (id, dto) => {
    const fd = new FormData()
    fd.append('Name',        dto.name)
    fd.append('Description', dto.description ?? '')
    fd.append('StartDate',   dto.startDate)
    fd.append('EndDate',     dto.endDate)
    if (dto.location)    fd.append('Location',    dto.location)
    if (dto.file)        fd.append('File',        dto.file)
    if (dto.artifactIds) dto.artifactIds.forEach(id => fd.append('ArtifactIds', id))
    return put(`/api/exhibitions/${id}`, fd)
  },

  delete: (id) => del(`/api/exhibitions/${id}`),
}

export const commentsApi = {
  getByArtifact: (artifactId) => get(`/api/comments/artifact/${artifactId}`),

  /** POST /api/comments  (requires auth) */
  create: (dto) => post('/api/comments', dto),
  // dto = { artifactId: number, text: string }

  /** DELETE /api/comments/:id  (requires auth, own comment) */
  delete: (id) => del(`/api/comments/${id}`),
}