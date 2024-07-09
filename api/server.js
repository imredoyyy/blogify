import express from "express";
import { connectToDb } from "./utils/connect-to-db";

import userRoute from "./routes/user.route";
import authRoute from "./routes/auth.route";
import post from "./routes/post.route";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
await connectToDb();

app
  .get("/", (req, res) => {
    res.send("Hello World!");
  })
  .use("/api/user", userRoute)
  .use("/api/auth", authRoute)
  .use("/api/post", post);

app.use((err, req, res, next) => {
  if (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
