import { Request, Response } from "express";
import taskModel from "../models/taskModel";
import mongoose from "mongoose";

export const searchTask = async (req: Request, res: Response): Promise<any> => {
  try {
    let query: any = {};

    let { assignedTo, dueDate, priority } = req.query;
    if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo as string)) {
      query.assignedTo = new mongoose.Types.ObjectId(assignedTo as string);
    }

    if (dueDate) {
      query.dueDate = new Date(dueDate as string);
    }

    if (priority) {
      query.priority = { $regex: new RegExp(priority as string, "i") };
    }

    const tasks = await taskModel
      .find(query)
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    if (!tasks.length) {
      return res.status(404).json({
        message: "No tasks found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Tasks found",
      success: true,
      tasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error,
    });
  }
};
