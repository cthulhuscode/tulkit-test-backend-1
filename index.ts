import "dotenv/config";
import express from "express";
import db from "./src/config/db";
import { seeder } from "./src/utils/seeder";
import candidates from "./src/routes/candidates";
import { errorHandler } from "./src/middleware/errorHandler";

const PORT = process.env.HTTP_PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;

export const app = express();
app.use(express.json());

// Routes
app.use("/candidates", candidates);

// Handle errors
app.use(errorHandler);

// Route not found
app.use((req, res, next) => {
  res
    .status(404)
    .json({ success: false, error: "The route specified wasn't found" });
});

// Connect the database
db().then(async () => {
  console.log("DB Connected");
  // Seed the database
  if (NODE_ENV === "development") await seeder();
});

app.listen(PORT).on("listening", () => {
  console.info("Listening on port", PORT);
});
