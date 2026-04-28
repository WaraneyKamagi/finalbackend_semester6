// utils/api.js
// API utility untuk berkomunikasi dengan backend Golang (Gin) di port 8080.
// Semua response dari backend menggunakan format: { success, message, data }
// File ini mengekstrak field 'data' agar komponen frontend tetap bekerja seperti sebelumnya.

const BASE_URL = 'http://localhost:8080/api'

// ==================== Helper ====================

/**
 * Helper untuk memproses response dari backend Go.
 * Backend mengembalikan format { success, message, data }.
 * Jika success=false, throw error dengan pesan dari backend.
 * Jika success=true, kembalikan field 'data' saja.
 */
const handleResponse = async (response) => {
  const result = await response.json()

  // Backend selalu mengembalikan JSON, tapi HTTP status mungkin error
  if (!response.ok || !result.success) {
    throw new Error(result.message || `HTTP error! status: ${response.status}`)
  }

  return result.data
}

// ==================== Auth ====================

export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  return handleResponse(response)
}

export const registerUser = async ({ name, email, password }) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })

  return handleResponse(response)
}

// ==================== Services ====================

export const fetchServices = async () => {
  const response = await fetch(`${BASE_URL}/services`)
  return handleResponse(response)
}

export const fetchServiceById = async (serviceId) => {
  const response = await fetch(`${BASE_URL}/services/${serviceId}`)
  return handleResponse(response)
}

// ==================== Orders ====================

export const createOrder = async (orderData) => {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  })

  return handleResponse(response)
}

export const getUserOrders = async (userId) => {
  const response = await fetch(`${BASE_URL}/orders/user/${userId}`)
  return handleResponse(response)
}

export const getOrderById = async (orderId) => {
  const response = await fetch(`${BASE_URL}/orders/${orderId}`)
  return handleResponse(response)
}

export const fetchAllOrders = async () => {
  const response = await fetch(`${BASE_URL}/orders`)
  return handleResponse(response)
}

export const updateOrder = async (orderId, updates) => {
  const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })

  return handleResponse(response)
}

export const deleteOrder = async (orderId) => {
  const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: 'DELETE',
  })

  await handleResponse(response)
  return true
}
