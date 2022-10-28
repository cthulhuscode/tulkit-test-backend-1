import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/errorResponse";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const NODE_ENV = process.env.NODE_ENV;
  if (NODE_ENV === "development") console.error(err);

  let message = "";
  let error: ErrorResponse;

  // Mongoose validation error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(",");
    error = new ErrorResponse(message, 400);

    // Custom error
  } else if (err.statusCode) {
    error = new ErrorResponse(err.message, err.statusCode);

    // Other errors
  } else {
    error = new ErrorResponse("Server error", 500);
  }

  res.status(error.statusCode).json({ success: false, error: error.message });
};
