import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  validateUpdateProfile,
  validatePagination,
} from "../validations/user.validation";

export const getUsers = [
  validatePagination,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await UserService.getAllUsers(page, limit);

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: result.pages,
        },
      });
    } catch (error: any) {
      next(new AppError(error.message, 500));
    }
  },
];

export const getUserProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await UserService.getUserById(req.user.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateProfile = [
  validateUpdateProfile,
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await UserService.updateUser(req.user.id, req.body);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error: any) {
      next(error);
    }
  },
];
