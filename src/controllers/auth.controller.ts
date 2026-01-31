import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AppError } from "../middleware/error.middleware";
import {
  validateRegistration,
  validateLogin,
} from "../validations/auth.validation";

export const register = [
  validateRegistration,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      const { user, token } = await AuthService.register({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user,
      });
    } catch (error: any) {
      next(new AppError(error.message, 400));
    }
  },
];

export const login = [
  validateLogin,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      const { user, token } = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user,
      });
    } catch (error: any) {
      next(new AppError(error.message, 401));
    }
  },
];

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};
