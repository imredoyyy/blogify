import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://cdn-icons-png.freepik.com/256/149/149071.png?semt=ais_hybrid",
    },
  },
  { timestamps: true }
);

const User = models?.User || mongoose.model("User", UserSchema);

export default User;
