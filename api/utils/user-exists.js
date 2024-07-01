import User from "../models/user";

export const userExists = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  return true;
};
