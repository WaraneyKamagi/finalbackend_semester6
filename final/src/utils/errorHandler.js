/**
 * Error Handler Utility
 * Utility sederhana untuk menangani error dari API
 */

/**
 * Format error message untuk ditampilkan ke user
 */
export function formatErrorMessage(error) {
  if (!error) {
    return 'Terjadi kesalahan yang tidak diketahui';
  }

  if (error.message) {
    return error.message;
  }

  return 'Terjadi kesalahan yang tidak diketahui';
}

/**
 * Handle error sederhana
 */
export function handleError(error) {
  const message = formatErrorMessage(error);
  
  // Log error untuk debugging
  console.error('Error:', error);
  
  return {
    message,
    error: error,
  };
}

export default {
  formatErrorMessage,
  handleError,
};

