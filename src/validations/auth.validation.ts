import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/error.middleware";

// Simple validation middleware
export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, email, password, confirmPassword } = req.body;

  // Check required fields
  if (!name || !email || !password || !confirmPassword) {
    return next(new AppError("All fields are required", 400));
  }

  // Check name length
  if (name.trim().length < 2) {
    return next(new AppError("Name must be at least 2 characters", 400));
  }

  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return next(new AppError("Please provide a valid email", 400));
  }

  // Check password length
  if (password.length < 6) {
    return next(new AppError("Password must be at least 6 characters", 400));
  }

  // Check password match
  if (password !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  next();
};
