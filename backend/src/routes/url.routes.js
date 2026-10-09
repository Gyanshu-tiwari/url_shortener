import express from "express";
import {
  createShortUrl,
  redirectFromShortUrl,
  getUrlStatsController,
} from "../controllers/url.controller.js";

const apiRouter = express.Router();
const redirectRouter = express.Router();

apiRouter.post("/", createShortUrl);
apiRouter.get("/:shortCode/stats", getUrlStatsController);
apiRouter.get("/:shortCode", getUrlStatsController);

redirectRouter.get("/:shortCode", redirectFromShortUrl);

export { apiRouter, redirectRouter };