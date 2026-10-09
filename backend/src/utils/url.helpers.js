export const isValidUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  let trimmed = value.trim();

  // If no scheme is present, prepend https:// for evaluation
  if (!/^https?:\/\//i.test(trimmed)) {
    // Avoid javascript:, data:, etc.
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
      return false;
    }
    trimmed = `https://${trimmed}`;
  }

  try {
    const url = new URL(trimmed);
    const isHttpOrHttps = url.protocol === "http:" || url.protocol === "https:";
    const hasValidHost =
      Boolean(url.hostname) &&
      (url.hostname === "localhost" || url.hostname.includes("."));
    return isHttpOrHttps && hasValidHost;
  } catch {
    return false;
  }

};

export const normalizeUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    return value;
  }

  let trimmed = value.trim();

  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const url = new URL(trimmed);
    return url.href;
  } catch {
    return trimmed;
  }
};