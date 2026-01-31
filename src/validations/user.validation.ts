import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/error.middleware";

export const validateUpdateProfile = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, email } = req.body;

  if (name && name.trim().length < 2) {
    return next(new AppError("Name must be at least 2 characters", 400));
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return next(new AppError("Please provide a valid email", 400));
    }
  }

  next();
};

export const validatePagination = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { page, limit } = req.query;

  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    return next(new AppError("Page must be a positive number", 400));
  }

  if (
    limit &&
    (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)
  ) {
    return next(new AppError("Limit must be between 1 and 100", 400));
  }

  next();
};
