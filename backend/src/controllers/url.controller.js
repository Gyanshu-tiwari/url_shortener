import asyncHandler from "../utils/tryCatch.js";
import {
  createShortCode,
  fetchOriginalUrl,
  fetchUrlStats,
} from "../services/url.service.js";

export const createShortUrl = asyncHandler(async (req, res) => {
  const shortCode = await createShortCode(req.body);

  const host = req.get("host");
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  const baseUrl = process.env.BASE_URL
    ? process.env.BASE_URL.replace(/\/+$/, "")
    : `${protocol}://${host}`;

  res.status(201).json({
    success: true,
    shortUrl: `${baseUrl}/${shortCode}`,
    shortCode,
  });
});


export const redirectFromShortUrl = asyncHandler(async (req, res) => {
  const { shortCode } = req.params;
  const originalUrl = await fetchOriginalUrl(shortCode);
  res.redirect(302, originalUrl);
});

export const getUrlStatsController = asyncHandler(async (req, res) => {
  const { shortCode } = req.params;
  const stats = await fetchUrlStats(shortCode);

  res.status(200).json({
    success: true,
    data: stats,
  });
});
