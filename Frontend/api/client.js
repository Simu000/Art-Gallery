
export const BASE_URL = 'http://localhost:5126'


async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }

  // 204 No Content
  if (res.status === 204) return null

  return res.json()
}

// ─── AUTH ───────────────────────────────────────────────────────────────────

export const auth = {
  register: (dto) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify(dto) }),

  login: (dto) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify(dto) }),

  verifyOtpRegistration: (dto) =>
    request('/api/auth/verify-otp-registration', { method: 'POST', body: JSON.stringify(dto) }),

  verifyOtpLogin: (dto) =>
    request('/api/auth/verify-otp-login', { method: 'POST', body: JSON.stringify(dto) }),
}

// ─── USER ────────────────────────────────────────────────────────────────────

export const userApi = {
  me: () => request('/api/user/me'),

  uploadProfileImage: (file) => {
    const form = new FormData()
    form.append('file', file)
    return fetch(`${BASE_URL}/api/user/me/profile-image`, {
      method: 'POST',
      credentials: 'include',
      body: form,
    }).then(r => r.json())
  },
}

// ─── ARTISTS ─────────────────────────────────────────────────────────────────

export const artistsApi = {
  getAll: () => request('/api/artists'),
  getById: (id) => request(`/api/artists/${id}`),
}

// ─── ARTIFACTS ───────────────────────────────────────────────────────────────

export const artifactsApi = {
  getAll: () => request('/api/artifacts'),
  getById: (id) => request(`/api/artifacts/${id}`),
  search: (q) => request(`/api/artifacts/search?q=${encodeURIComponent(q)}`),
  getFacts: () => request('/api/artifacts/facts'),
}

// ─── EXHIBITIONS ─────────────────────────────────────────────────────────────

export const exhibitionsApi = {
  getAll: () => request('/api/exhibitions'),
  getById: (id) => request(`/api/exhibitions/${id}`),
}

// ─── COMMENTS ────────────────────────────────────────────────────────────────

export const commentsApi = {
  getByArtifact: (artifactId) => request(`/api/comments/artifact/${artifactId}`),

  create: (dto) =>
    request('/api/comments', { method: 'POST', body: JSON.stringify(dto) }),

  delete: (id) =>
    request(`/api/comments/${id}`, { method: 'DELETE' }),
}