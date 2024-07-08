import { usernameExists } from "./user-exists";

export const generateUsername = async (email) => {
  const baseUsername = email.split("@")[0].toLowerCase();
  let uniqueUsername =
    baseUsername + Math.floor(Math.random() * 1000).toString();
  let attempt = 1;
  const maxAttempts = 12;

  while (await usernameExists(uniqueUsername)) {
    // Generate username
    uniqueUsername =
      baseUsername + Math.floor(Math.random() * 1000).toString() + Date.now();
    attempt++;

    // If max attempts reached, throw error
    // to avoid infinite loop
    if (attempt >= maxAttempts) {
      throw new Error("Max attempts exceeded to generate unique username");
    }
  }

  return uniqueUsername;
};
