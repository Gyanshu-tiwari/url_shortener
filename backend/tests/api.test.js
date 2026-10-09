import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import UrlModel from "../src/models/url.model.js";

// In-memory mock store for integration tests
const mockDatabase = new Map();

describe("HTTP API Integration Tests", () => {
  beforeEach(() => {
    mockDatabase.clear();

    // Mock UrlModel static and prototype methods
    UrlModel.exists = async (query) => {
      if (query && query.shortCode) {
        return mockDatabase.has(query.shortCode) ? { _id: "mock_id" } : null;
      }
      return null;
    };

    UrlModel.prototype.save = async function () {
      const doc = {
        shortCode: this.shortCode,
        originalUrl: this.originalUrl,
        clicks: this.clicks || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockDatabase.set(this.shortCode, doc);
      return doc;
    };

    UrlModel.findOneAndUpdate = async (filter, update) => {
      const shortCode = filter?.shortCode;
      const doc = mockDatabase.get(shortCode);
      if (!doc) return null;
      if (update?.$inc?.clicks) {
        doc.clicks += update.$inc.clicks;
      }
      return doc;
    };

    UrlModel.findOne = (filter) => {
      const shortCode = filter?.shortCode;
      const doc = mockDatabase.get(shortCode);
      return {
        select: async () => doc || null,
      };
    };
  });

  describe("Health Check", () => {
    it("GET /health should return 200 and healthy status", async () => {
      const res = await request(app).get("/health");
      assert.equal(res.status, 200);
      assert.equal(res.body.status, "ok");
      assert.equal(res.body.service, "url-shortener-api");
      assert.ok(res.body.timestamp);
    });
  });

  describe("POST /api/url", () => {
    it("should return 400 when originalUrl is missing", async () => {
      const res = await request(app)
        .post("/api/url")
        .send({});

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.ok(res.body.message.includes("Invalid originalUrl"));
    });

    it("should return 400 when originalUrl is invalid", async () => {
      const res = await request(app)
        .post("/api/url")
        .send({ originalUrl: "javascript:alert(1)" });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    it("should return 201 with generated shortCode and shortUrl for valid URL", async () => {
      const res = await request(app)
        .post("/api/url")
        .send({ originalUrl: "https://example.com/some/long/path" });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.ok(res.body.shortCode);
      assert.ok(res.body.shortUrl);
      assert.ok(res.body.shortUrl.endsWith(res.body.shortCode));
      assert.equal(mockDatabase.has(res.body.shortCode), true);
    });

    it("should return 201 and respect customCode if valid and available", async () => {
      const res = await request(app)
        .post("/api/url")
        .send({
          originalUrl: "https://docs.github.com",
          customCode: "my-custom-doc",
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.shortCode, "my-custom-doc");
      assert.ok(res.body.shortUrl.includes("my-custom-doc"));
      assert.equal(mockDatabase.has("my-custom-doc"), true);
    });

    it("should return 400 when customCode is shorter than 3 characters", async () => {
      const res = await request(app)
        .post("/api/url")
        .send({
          originalUrl: "https://example.com",
          customCode: "ab",
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.ok(res.body.message.includes("3-30 characters"));
    });

    it("should return 400 when customCode contains forbidden characters", async () => {
      const res = await request(app)
        .post("/api/url")
        .send({
          originalUrl: "https://example.com",
          customCode: "bad code!",
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    it("should return 400 when customCode is reserved keyword", async () => {
      const res = await request(app)
        .post("/api/url")
        .send({
          originalUrl: "https://example.com",
          customCode: "health",
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.ok(res.body.message.includes("reserved"));
    });

    it("should return 409 when customCode is already in use", async () => {
      mockDatabase.set("taken-code", {
        shortCode: "taken-code",
        originalUrl: "https://taken.com",
        clicks: 0,
      });

      const res = await request(app)
        .post("/api/url")
        .send({
          originalUrl: "https://example.com",
          customCode: "taken-code",
        });

      assert.equal(res.status, 409);
      assert.equal(res.body.success, false);
      assert.ok(res.body.message.includes("already in use"));
    });
  });

  describe("GET /:shortCode (Redirection)", () => {
    it("should redirect (302) to originalUrl when shortCode exists", async () => {
      mockDatabase.set("target1", {
        shortCode: "target1",
        originalUrl: "https://target-domain.com/landing",
        clicks: 0,
      });

      const res = await request(app).get("/target1");
      assert.equal(res.status, 302);
      assert.equal(res.headers.location, "https://target-domain.com/landing");
      assert.equal(mockDatabase.get("target1").clicks, 1);
    });

    it("should return 404 when shortCode is not found", async () => {
      const res = await request(app).get("/does-not-exist");
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
    });
  });

  describe("GET /api/url/:shortCode/stats", () => {
    it("should return stats and click count for existing code", async () => {
      mockDatabase.set("stats-code", {
        shortCode: "stats-code",
        originalUrl: "https://stats.example.com",
        clicks: 7,
        createdAt: new Date(),
      });

      const res = await request(app).get("/api/url/stats-code/stats");
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.shortCode, "stats-code");
      assert.equal(res.body.data.clicks, 7);
    });

    it("should return 404 when fetching stats for non-existent code", async () => {
      const res = await request(app).get("/api/url/missing-code/stats");
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
    });
  });

  describe("404 Route handling", () => {
    it("should return 404 JSON for unknown API paths", async () => {
      const res = await request(app).get("/api/unknown/endpoint");
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
      assert.ok(res.body.message.includes("not found"));
    });
  });
});
