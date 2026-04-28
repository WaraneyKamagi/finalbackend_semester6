/**
 * API Client Utility
 * Utility sederhana untuk melakukan HTTP requests ke backend
 */

import API_CONFIG from '../config/api.js';

/**
 * GET request
 */
export async function get(endpoint) {
  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * POST request
 */
export async function post(endpoint, body) {
  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * PATCH request
 */
export async function patch(endpoint, body) {
  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * DELETE request
 */
export async function del(endpoint) {
  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Export default
export default {
  get,
  post,
  patch,
  delete: del,
};

