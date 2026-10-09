import UrlModel from "../models/url.model.js";
import { ApiError } from "../utils/errorHandler.js";

export const saveShortUrl = async (shortCode, originalUrl) => {
  const urlDoc = new UrlModel({
    originalUrl,
    shortCode,
  });
  return await urlDoc.save();
};

export const getFullUrl = async (shortCode) => {
  const fullUrl = await UrlModel.findOneAndUpdate(
    { shortCode },
    { $inc: { clicks: 1 } },
    { returnDocument: "after" }
  );

  if (!fullUrl) {
    throw new ApiError(404, "Short URL not found");
  }

  return fullUrl.originalUrl;
};

export const getUrlStats = async (shortCode) => {
  const urlDoc = await UrlModel.findOne({ shortCode }).select(
    "shortCode originalUrl clicks createdAt updatedAt"
  );

  if (!urlDoc) {
    throw new ApiError(404, "Short URL not found");
  }

  return urlDoc;
};

export const shortCodeExists = async (shortCode) => {
  const doc = await UrlModel.exists({ shortCode });
  return Boolean(doc);
};
