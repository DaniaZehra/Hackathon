const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = data.detail || data.error || 'Request failed'
    throw new Error(message)
  }
  return data
}

export async function signupUser({ firstname, lastname, username, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstname, lastname, username, password }),
  })

  return handleResponse(response)
}

export async function loginUser({ username, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  return handleResponse(response)
}

export async function fetchUser(username) {
  const response = await fetch(`${API_BASE_URL}/user/${encodeURIComponent(username)}`)
  return handleResponse(response)
}

export async function updateUserProfile(username, updates) {
  const response = await fetch(`${API_BASE_URL}/user/${encodeURIComponent(username)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })

  return handleResponse(response)
}

export async function sendMoney(username, transfer) {
  const response = await fetch(
    `${API_BASE_URL}/user/${encodeURIComponent(username)}/transfer`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transfer),
    },
  )

  return handleResponse(response)
}

export async function addFunds(username, payload) {
  const response = await fetch(
    `${API_BASE_URL}/user/${encodeURIComponent(username)}/add-funds`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  )

  return handleResponse(response)
}

export async function payBill(username, payload) {
  const response = await fetch(
    `${API_BASE_URL}/user/${encodeURIComponent(username)}/pay-bill`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  )

  return handleResponse(response)
}