import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ApiError, errorHandler } from "../src/utils/errorHandler.js";

// Mock Express response
const createMockRes = () => {
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
};

describe("errorHandler & ApiError tests", () => {
  it("ApiError creates proper error instances", () => {
    const error = new ApiError(404, "Not Found");
    assert.equal(error.statusCode, 404);
    assert.equal(error.message, "Not Found");
    assert.equal(error.isOperational, true);
    assert.ok(error instanceof Error);
  });

  it("errorHandler handles ApiError correctly", () => {
    const res = createMockRes();
    const err = new ApiError(400, "Bad Request");

    errorHandler(err, {}, res, () => {});

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, "Bad Request");
  });

  it("errorHandler handles error with status property", () => {
    const res = createMockRes();
    const err = new Error("Resource missing");
    err.status = 404;

    errorHandler(err, {}, res, () => {});

    assert.equal(res.statusCode, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, "Resource missing");
  });

  it("errorHandler handles duplicate key error (code 11000)", () => {
    const res = createMockRes();
    const err = new Error("E11000 duplicate key error");
    err.code = 11000;
    err.keyPattern = { shortCode: 1 };

    errorHandler(err, {}, res, () => {});

    assert.equal(res.statusCode, 409);
    assert.equal(res.body.success, false);
    assert.ok(res.body.message.includes("ShortCode already exists"));
  });

  it("errorHandler handles Mongoose ValidationError", () => {
    const res = createMockRes();
    const err = new Error("Validation failed");
    err.name = "ValidationError";
    err.errors = {
      originalUrl: { message: "Path `originalUrl` is required." },
    };

    errorHandler(err, {}, res, () => {});

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, "Path `originalUrl` is required.");
  });

  it("errorHandler falls back to 500 Internal Server Error", () => {
    const res = createMockRes();
    const err = new Error();

    errorHandler(err, {}, res, () => {});

    assert.equal(res.statusCode, 500);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, "Internal Server Error");
  });
});
