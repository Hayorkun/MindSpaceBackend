import express from "express";
import UserRoutes from "./routes/UserRoute.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(express.json());

app.use("/api/user", UserRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Successfully connected to Mongo db");
  })
  .catch((error) => {
    console.log("Error connecting to Mongo db", error);
  });
