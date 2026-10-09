import { nanoid } from "nanoid";
import { shortCodeExists } from "../dao/url.dao.js";

const SHORT_CODE_LENGTH = 7;
const MAX_ATTEMPTS = 10;

export const generateShortCode = async () => {
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    const code = nanoid(SHORT_CODE_LENGTH);
    const exists = await shortCodeExists(code);
    if (!exists) {
      return code;
    }
    attempts += 1;
  }

  throw new Error("Failed to generate a unique short code. Please try again.");
};