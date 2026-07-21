import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  emall: { type: String, required: true, unique: true },
  password: { type: String, required: true, },
  taks: { type: String, required: false }
}) 

const User = mongoose.model("users", userSchema);

export default User