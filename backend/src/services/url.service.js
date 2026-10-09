import { generateShortCode } from "../utils/generateShortCode.js";
import { saveShortUrl, getFullUrl, getUrlStats, shortCodeExists } from "../dao/url.dao.js";
import { isValidUrl, normalizeUrl } from "../utils/url.helpers.js";
import { ApiError } from "../utils/errorHandler.js";

const RESERVED_CODES = new Set([
  "api",
  "health",
  "favicon.ico",
  "robots.txt",
  "static",
  "assets",
  "stats",
  "undefined",
  "null",
]);

export const createShortCode = async (payload = {}) => {
  const rawOriginalUrl = payload.originalUrl || payload.originalURL;

  if (!rawOriginalUrl || !isValidUrl(rawOriginalUrl)) {
    throw new ApiError(400, "Invalid originalUrl. Please provide a valid HTTP or HTTPS URL.");
  }

  const normalizedOriginalUrl = normalizeUrl(rawOriginalUrl);
  let shortCode = "";

  const customCode = payload.customCode?.trim();
  if (customCode) {
    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(customCode)) {
      throw new ApiError(
        400,
        "Custom code must be 3-30 characters long and contain only letters, numbers, hyphens, and underscores."
      );
    }

    if (RESERVED_CODES.has(customCode.toLowerCase())) {
      throw new ApiError(400, "The specified custom code is reserved. Please choose another.");
    }

    const exists = await shortCodeExists(customCode);
    if (exists) {
      throw new ApiError(409, "Custom short code is already in use. Please pick another.");
    }

    shortCode = customCode;
  } else {
    shortCode = await generateShortCode();
  }

  if (!shortCode) {
    throw new ApiError(500, "Failed to generate short code");
  }

  await saveShortUrl(shortCode, normalizedOriginalUrl);
  return shortCode;
};

export const fetchOriginalUrl = async (shortCode) => {
  if (!shortCode) {
    throw new ApiError(400, "Short code is required");
  }
  return await getFullUrl(shortCode);
};

export const fetchUrlStats = async (shortCode) => {
  if (!shortCode) {
    throw new ApiError(400, "Short code is required");
  }
  return await getUrlStats(shortCode);
};

