import express from "express";
import { connectToDb } from "./utils/connect-to-db";

import userRoute from "./routes/user.route";
import authRoute from "./routes/auth.route";

const app = express();
app.use(express.json());
const PORT = 3000;
connectToDb();

app
  .get("/", (req, res) => {
    res.send("Hello World!");
  })
  .use("/api/user", userRoute)
  .use("/api/auth", authRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
