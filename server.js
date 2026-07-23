import express from "express";
import UserRoutes from "./routes/UserRoute.js";
import TaskRoutes from "./routes/TaskRoute.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"

dotenv.config();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173", "https://mindspace-virid.vercel.app"] }));

app.use("/api/users", UserRoutes);
app.use("/api/tasks", TaskRoutes);

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
