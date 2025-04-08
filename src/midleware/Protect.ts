import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import userModel from "../models/userModel";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

interface AuthRequest extends Request {
  user?: any;
}

export const Protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let token;

    // Check if Authorization header is present
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not logged in! Please log in.",
      });
    }

    // Verify Token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;
    // Fetch the user from the database
    const this_user = await userModel.findById(decoded.userId);
    if (!this_user) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or user does not exist.",
      });
    }

    // Attach user to request object
    req.user = this_user;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication failed!",
      error,
    });
  }
};

export const restrictTo =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  };
