import { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middleware";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  next(new AppError(`Not found - ${req.originalUrl}`, 404));
};
