import { getToken } from './auth'

const BASE = '/api'

async function request(path, { method = 'GET', body, headers } = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let data
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!res.ok) throw new Error(typeof data === 'string' ? data : (data?.message || 'Request failed'))
  return data
}

export const api = {
  // auth
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  login:  (payload) => request('/auth/login',  { method: 'POST', body: payload }),
  me:     () => request('/auth/me'),

  // verify email
  verifyEmail:  (token) => request(`/auth/verify?token=${encodeURIComponent(token)}`),
  resendVerify: (email) => request('/auth/resend', { method: 'POST', body: { email } }),

  // forgot / reset
  forgotPassword: (email) => request('/auth/forgot', { method: 'POST', body: { email } }),
  resetPassword:  ({ token, password }) => request('/auth/reset', { method: 'POST', body: { token, password } }),
}

export default api
