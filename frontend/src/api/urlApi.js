

// In production, fallback to relative path /api/url if VITE_API_BASE_URL is not set.
// In development, fallback to localhost:3000/api/url.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:3000/api/url" : "/api/url");


export const shortenUrl = async (payload) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to shorten URL");
  }

  return data;
};

