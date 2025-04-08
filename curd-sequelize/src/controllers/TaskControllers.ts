import { Request, Response } from "express";
import userModel from "../models/userModel";
import Task, { ITask } from "../models/Task";
import User from "../models/User";
import { where } from "sequelize";

export const CreateTasks = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let {
      title,
      description,
      dueDate,
      priority,
      statu,
      assignedToId,
      assignedById,
    } = req.body as ITask;

    if (!title || !assignedById || !assignedToId || !description) {
      return res.status(400).json({
        message: "All Fields are Required",
        success: false,
      });
    }

    const assignedToUser = await User.findByPk(assignedToId);
    const assignedByUser = await User.findByPk(assignedById);

    if (!assignedByUser || !assignedToUser) {
      return res.status(400).json({
        message: "Assigned user(s) not found",
        success: false,
      });
    }
    const existingTask = await Task.findOne({
      where: {
        title,
        description,
        priority,
        statu,
        assignedById,
        assignedToId,
      },
    });
    if (existingTask) {
      return res.status(400).json({
        message: "Task Already Exists",
        success: false,
      });
    }
    const newTask = await Task.create({
      title,
      assignedToId,
      assignedById,
      description,
      priority,
      statu,
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
      success: false,
      error,
    });
  }
};

export const getTasks = async (req: Request, res: Response): Promise<any> => {
  try {
    const { assignedById } = req.query as any;
    const task = await Task.findAll({
      where: { assignedById },
      include: [
        { model: User, as: "assingedToId", attributes: ["name"] },
        { model: User, as: "assingedById", attributes: ["name"] },
      ],
    });
    if (!task) {
      return res.status(400).json({
        message: "Task not exists",
        success: false,
      });
    } else {
      return res.status(200).json({
        message: "All task found",
        success: true,
        task: task,
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

export const getTaskByIds = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let { id } = req.query as any;
    const task = await Task.findOne({
      where: { id },
      include: [
        { model: User, as: "assignedById", attributes: ["name"] },
        { model: User, as: "assignedToId", attributes: ["name"] },
      ],
    });
    return res.status(200).json({
      message: "All task found",
      success: true,
      task: task,
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong!",
      success: false,
      error,
    });
  }
};

export const deleteTasks = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let { id } = req.query as any;

    const tasks = await Task.destroy({ where: { id } });
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

export const updateTasks = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.query as any;
    const updateData = req.body as ITask;
    const updatedTask = await Task.update(updateData, {
      where: { id },
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
