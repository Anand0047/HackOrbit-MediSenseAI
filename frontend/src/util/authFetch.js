import { showErrorToast, showWarningToast } from '../components/Toast';

/**
 * Enhanced fetch wrapper with JWT token and graceful error handling
 * @param {string} url - The API endpoint
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<Response|null>} - Returns response or null if failed
 */
export default async function authFetch(url, options = {}) {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 429) {
      showWarningToast("Too many requests. Please try again later.");
      return null;
    }

    return res;
  } catch (err) {
    if (err.message === "Failed to fetch") {
      showErrorToast("Network error. Please check your connection.");
    } else {
      showErrorToast("An unexpected error occurred");
    }
    return null;
  }
}
