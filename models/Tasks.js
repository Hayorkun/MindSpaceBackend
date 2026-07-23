import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: false },
    category: {type: String, enum: ["personal", "finance", "health", "work"]},
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    priority: { type: String, enum: ["low", "medium", "high"] },
    dueDate: { type: Date },
  },
  { timestamps: true },
);


const Tasks = mongoose.model("tasks", taskSchema);

export default Tasks