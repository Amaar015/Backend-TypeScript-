import { Request, Response } from "express";
import userModel, { IUser } from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const Register = async (req: any, res: any) => {
  try {
    let { name, role, email, password } = req.body as IUser;

    if (!name) {
      res.status(400).json({ message: "Name is required", success: false });
    }
    if (!role) {
      res
        .status(400)
        .json({ message: "User role is required", success: false });
    }
    if (!email) {
      res
        .status(400)
        .json({ message: "user email is required", success: false });
    }
    if (!password) {
      res.status(400).json({ message: "Password is required", success: false });
    }
    const Existing_user = await userModel.findOne({ email });
    if (Existing_user) {
      res.status(400).json({
        message: "User already exist! please go login",
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      name,
      role,
      email,
      password,
    });
    return res.status(201).json({
      message: "User Registered Successfully!",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong! server side",
      error,
      success: false,
    });
  }
};

export const Login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found! go to login",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "2d" }
    );
    res.status(200).json({
      message: "Login Successfully!",
      user,
      token,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong! server side",
      error,
      success: false,
    });
  }
};
