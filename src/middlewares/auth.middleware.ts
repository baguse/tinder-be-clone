import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { throwError } from "@utils/error.util";
import { RequestWithUser } from "@interfaces/express.interface";
import User from "@models/user.model";
import envConfig from "@utils/envConfig.util";
import ERROR_CODES from "@constants/error.const";

export function validateToken() {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { token } = req.cookies;
      if (!token) {
        throwError(ERROR_CODES.AUTH_UNAUTHORIZED);
      }

      const {
        JWT_SECRET,
      } = envConfig;
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
      if (!decoded) {
        throwError(ERROR_CODES.AUTH_UNAUTHORIZED);
      }

      const user = await User.findOne({
        where: {
          id: decoded.id,
        },
      });

      if (!user) {
        throwError(ERROR_CODES.AUTH_UNAUTHORIZED);
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(error.httpStatus || StatusCodes.INTERNAL_SERVER_ERROR).json({
        code: error.errorCode,
        message: error.message,
      });
    }
  };
}
