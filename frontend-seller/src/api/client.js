/**
 * Seller API client with JWT auth.
 * Token stored in localStorage; request() sends Authorization header.
 */

const TOKEN_KEY = 'artisan_seller_token'

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '')
  }
  return ''
}

const baseUrl = getBaseUrl()

function buildUrl(endpoint) {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  if (baseUrl) return `${baseUrl}${path}`
  return `/api${path}`
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function clearToken() {
  setToken(null)
}

async function request(endpoint, options = {}) {
  const url = buildUrl(endpoint)
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(url, { ...options, headers })
  const data = await response.json().catch(() => ({}))

  if (response.status === 401) {
    clearToken()
  }

  if (!response.ok) {
    const error = new Error(data.error || data.message || `HTTP ${response.status}`)
    error.status = response.status
    error.data = data
    throw error
  }
  return data
}

/** GET /api/auth/session */
export async function getSession() {
  try {
    return await request('/auth/session')
  } catch (err) {
    if (err.status === 404) return { success: true, loggedIn: false, user: null }
    clearToken()
    return { success: true, loggedIn: false, user: null }
  }
}

/** POST /api/auth/register - { email, password, name? } */
export async function register(body) {
  const res = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (res.token) setToken(res.token)
  return res
}

/** POST /api/auth/login - { email, password } */
export async function login(body) {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (res.token) setToken(res.token)
  return res
}

/** POST /api/auth/logout - client clears token */
export async function logout() {
  try {
    await request('/auth/logout', { method: 'POST' })
  } finally {
    clearToken()
  }
}
