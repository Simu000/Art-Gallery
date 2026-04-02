// api/client.js
// Base URL — change this to match your backend in production
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    credentials: 'include', // always send JWT cookie
    ...options,
    headers: {
      // Don't set Content-Type for FormData (browser sets it with boundary)
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  })

  if (!res.ok) {
    // Try to parse a JSON error body, otherwise fall back to status text
    let msg = `Request failed: ${res.status} ${res.statusText}`
    try {
      const json = await res.json()
      msg = json.message ?? json.title ?? JSON.stringify(json)
    } catch {
      // ignore parse errors
    }
    throw new Error(msg)
  }

  // 204 No Content — nothing to parse
  if (res.status === 204) return null

  return res.json()
}

const get  = (path)        => request(path)
const post = (path, body)  => request(path, { method: 'POST',   body: body instanceof FormData ? body : JSON.stringify(body) })
const put  = (path, body)  => request(path, { method: 'PUT',    body: body instanceof FormData ? body : JSON.stringify(body) })
const del  = (path)        => request(path, { method: 'DELETE' })

// ─── Auth  (/api/auth/*) ──────────────────────────────────────────────────────
export const auth = {
  /** POST /api/auth/register  — sends OTP to email */
  register: (dto) => post('/api/auth/register', dto),

  /** POST /api/auth/login  — sends OTP to email */
  login: (dto) => post('/api/auth/login', dto),

  /** POST /api/auth/verify-otp-registration  — sets JWT cookie on success */
  verifyOtpRegistration: (dto) => post('/api/auth/verify-otp-registration', dto),

  /** POST /api/auth/verify-otp-login  — sets JWT cookie on success */
  verifyOtpLogin: (dto) => post('/api/auth/verify-otp-login', dto),
}

// ─── Current user  (/api/user/*) ─────────────────────────────────────────────
export const userApi = {
  /** GET /api/user/me  — returns CurrentUserDto (requires auth cookie) */
  me: () => get('/api/user/me'),

  /** GET /api/user  — returns all users (Admin only) */
  getAll: () => get('/api/user'),

  /** POST /api/user/me/profile-image  — multipart upload */
  uploadProfileImage: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return post('/api/user/me/profile-image', fd)
  },
}

// ─── Artists  (/api/artists/*) ───────────────────────────────────────────────
export const artistsApi = {
  /** GET /api/artists */
  getAll: () => get('/api/artists'),

  /** GET /api/artists/:id */
  getById: (id) => get(`/api/artists/${id}`),

  /** POST /api/artists  (Admin, multipart) */
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

  /** PUT /api/artists/:id  (Admin, multipart) */
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

  /** DELETE /api/artists/:id  (Admin) */
  delete: (id) => del(`/api/artists/${id}`),
}

// ─── Artifacts  (/api/artifacts/*) ──────────────────────────────────────────
export const artifactsApi = {
  /** GET /api/artifacts */
  getAll: () => get('/api/artifacts'),

  /** GET /api/artifacts/:id */
  getById: (id) => get(`/api/artifacts/${id}`),

  /** GET /api/artifacts/search?q=query */
  search: (q) => get(`/api/artifacts/search?q=${encodeURIComponent(q)}`),

  /** GET /api/artifacts/facts */
  getFacts: () => get('/api/artifacts/facts'),

  /** POST /api/artifacts  (Admin, multipart) */
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

  /** PUT /api/artifacts/:id  (Admin, multipart) */
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

  /** DELETE /api/artifacts/:id  (Admin) */
  delete: (id) => del(`/api/artifacts/${id}`),
}

// ─── Exhibitions  (/api/exhibitions/*) ───────────────────────────────────────
export const exhibitionsApi = {
  /** GET /api/exhibitions */
  getAll: () => get('/api/exhibitions'),

  /** GET /api/exhibitions/:id */
  getById: (id) => get(`/api/exhibitions/${id}`),

  /** POST /api/exhibitions  (Admin, multipart) */
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

  /** PUT /api/exhibitions/:id  (Admin, multipart) */
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

  /** DELETE /api/exhibitions/:id  (Admin) */
  delete: (id) => del(`/api/exhibitions/${id}`),
}

// ─── Comments  (/api/comments/*) ─────────────────────────────────────────────
export const commentsApi = {
  /** GET /api/comments/artifact/:artifactId */
  getByArtifact: (artifactId) => get(`/api/comments/artifact/${artifactId}`),

  /** POST /api/comments  (requires auth) */
  create: (dto) => post('/api/comments', dto),
  // dto = { artifactId: number, text: string }

  /** DELETE /api/comments/:id  (requires auth, own comment) */
  delete: (id) => del(`/api/comments/${id}`),
}