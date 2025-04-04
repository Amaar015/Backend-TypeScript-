import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  role: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.model<IUser>("client", userSchema);

export default userModel;
