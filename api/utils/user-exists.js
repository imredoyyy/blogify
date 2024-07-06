import User from "../models/user";

export const userExists = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  return true;
};

export const usernameExists = async (username) => {
  const user = await User.findOne({ username });

  if (user) {
    return true;
  } else {
    return false;
  }
};
