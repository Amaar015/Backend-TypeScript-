import { Request, Response } from "express";
import taskModel, { Itask } from "../models/taskModel";
import userModel from "../models/userModel";

export const CreateTask = async (req: any, res: any) => {
  try {
    let {
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      assignedBy,
    } = req.body as Itask;

    if (!title || !assignedBy || !assignedTo || !description) {
      return res.status(400).json({
        message: "All Fields are Required",
        success: false,
      });
    }

    const assignedToUser = await userModel.find({ assignedTo });
    const assignedByUser = await userModel.find({ assignedBy });

    if (!assignedByUser || !assignedToUser) {
      return res.status(400).json({
        message: "Assigned user(s) not found",
        success: false,
      });
    }
    const existingTask = await taskModel.findOne({
      title,
      assignedTo,
      assignedBy,
      description,
      priority,
      status,
    });
    if (existingTask) {
      return res.status(400).json({
        message: "Task Already Exists",
        success: false,
      });
    }
    const newTask = await taskModel.create({
      title,
      assignedTo,
      assignedBy,
      description,
      priority,
      status,
      dueDate,
    });
    return res.status(200).json({
      message: "Task Created Successfully!",
      success: true,
      newTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
      required: false,
      success: false,
      error,
    });
  }
};

export const getTask = async (req: any, res: any) => {
  try {
    const { assignedBy } = req.query;
    const Task = await taskModel
      .find({ assignedBy })
      .populate("assignedBy", "name")
      .sort({ createdAt: -1 });
    if (!Task) {
      return res.status(400).json({
        message: "Task not exists",
        success: false,
      });
    } else {
      return res.status(200).json({
        message: "All task found",
        success: true,
        task: Task,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong!",
      success: false,
      error,
    });
  }
};

export const getTaskById = async (req: any, res: any) => {
  try {
    let { id } = req.query;
    const Task = await taskModel.findById(id);
    return res.status(200).json({
      message: "All task found",
      success: true,
      task: Task,
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong!",
      success: false,
      error,
    });
  }
};

export const deleteTask = async (req: any, res: any) => {
  try {
    let { id } = req.query;

    const tasks = await taskModel.deleteOne({ _id: id });
    if (tasks) {
      return res.status(200).json({
        message: "Task deleted Successfully",
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "Something went wrong!",
        success: false,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong!",
      success: false,
      error,
    });
  }
};

export const updateTask = async (req: any, res: any) => {
  try {
    const { id } = req.query;
    const updateData = req.body as Itask;
    const updatedTask = await taskModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Task updated successfully",
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong!",
      success: false,
      error,
    });
  }
};
