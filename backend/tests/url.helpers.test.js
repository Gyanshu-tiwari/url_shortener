import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isValidUrl, normalizeUrl } from "../src/utils/url.helpers.js";

describe("url.helpers unit tests", () => {
  describe("isValidUrl", () => {
    it("should accept valid https URLs", () => {
      assert.equal(isValidUrl("https://example.com"), true);
      assert.equal(isValidUrl("https://github.com/nodejs/node?test=1#hash"), true);
      assert.equal(isValidUrl("https://sub.domain.co.uk/path/to/page"), true);
    });

    it("should accept valid http URLs", () => {
      assert.equal(isValidUrl("http://example.com"), true);
      assert.equal(isValidUrl("http://localhost:3000/api"), true);
    });

    it("should accept valid URLs provided without protocol", () => {
      assert.equal(isValidUrl("google.com"), true);
      assert.equal(isValidUrl("github.com/test/repo"), true);
      assert.equal(isValidUrl("sub.domain.org/test?query=param"), true);
    });

    it("should reject invalid or malicious protocols", () => {
      assert.equal(isValidUrl("javascript:alert(1)"), false);
      assert.equal(isValidUrl("data:text/html;base64,PHNjcmlwdD4="), false);
      assert.equal(isValidUrl("file:///etc/passwd"), false);
      assert.equal(isValidUrl("ftp://ftp.example.com"), false);
    });

    it("should reject non-string, empty, or nonsense inputs", () => {
      assert.equal(isValidUrl(""), false);
      assert.equal(isValidUrl("   "), false);
      assert.equal(isValidUrl("not-a-valid-url"), false);
      assert.equal(isValidUrl(null), false);
      assert.equal(isValidUrl(undefined), false);
      assert.equal(isValidUrl(12345), false);
    });
  });

  describe("normalizeUrl", () => {
    it("should preserve https protocol", () => {
      const result = normalizeUrl("https://example.com/test");
      assert.equal(result, "https://example.com/test");
    });

    it("should prepend https if protocol was omitted", () => {
      const result = normalizeUrl("example.com/about");
      assert.equal(result, "https://example.com/about");
    });

    it("should trim surrounding whitespace", () => {
      const result = normalizeUrl("   https://example.com/path   ");
      assert.equal(result, "https://example.com/path");
    });

    it("should return unchanged if non-string", () => {
      assert.equal(normalizeUrl(null), null);
      assert.equal(normalizeUrl(undefined), undefined);
    });
  });
});
