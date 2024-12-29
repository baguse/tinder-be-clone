import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "@constants/error.const";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateBody(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: { message: string; path: (string | number)[] }) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: ERROR_CODES.INVALID_PAYLOAD.message, code: ERROR_CODES.INVALID_PAYLOAD.errorCode, data: errorMessages });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
      }
    }
  };
}
