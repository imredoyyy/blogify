import express from "express";
import { connectToDb } from "./utils/connect-to-db";

import userRoute from "./routes/user.route";

const app = express();
const PORT = 3000;
connectToDb();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", userRoute);
console.log("User route registered");

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
