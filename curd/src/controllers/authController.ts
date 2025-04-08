import { Request, Response } from "express";
import userModel, { IUser } from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, role, email, password } = req.body as IUser;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Name is required", success: false });
    }
    if (!role) {
      return res
        .status(400)
        .json({ message: "User role is required", success: false });
    }
    if (!email) {
      return res
        .status(400)
        .json({ message: "User email is required", success: false });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required", success: false });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists! Please go to login.",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      role,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User Registered Successfully!",
      user,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong! Server side",
      error,
      success: false,
    });
  }
};

const Login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found! Please register first.",
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
    const roleToken = jwt.sign(
      { role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "10d" }
    );

    return res.status(200).json({
      message: "Login Successfully!",
      user,
      token,
      roleToken,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong! Server side",
      error,
      success: false,
    });
  }
};

export { Login, Register };
