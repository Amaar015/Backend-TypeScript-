import mongoose from "mongoose";

export interface Itask extends mongoose.Document {
  title: string;
  dueDate: Date;
  description: string;
  priority: string;
  status: string;
  assignedTo: mongoose.Types.ObjectId;
  assignedBy: mongoose.Types.ObjectId;
}

const taskSchema = new mongoose.Schema<Itask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    dueDate: {
      type: Date,
      default: Date.now,
    },
    priority: {
      type: String,
      enum: ["Normal", "High", "Low"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Closed", "Active", "Pending"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
    },
  },
  { timestamps: true }
);

const taskModel = mongoose.model("target", taskSchema);

export default taskModel;
