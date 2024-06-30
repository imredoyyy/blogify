import express from "express";
import { connectToDb } from "./utils/connect-to-db";

const app = express();

connectToDb();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
