import User from "@models/user.model";
import { StatusCodes } from "http-status-codes";
import { compareSync } from "bcryptjs";
import { Response, Request } from "express";
import { throwError } from "@utils/error.util";
import { IUserLogin } from "@schemas/user.schema";
import { sign } from "jsonwebtoken";
import envConfig from "@utils/envConfig.util";
import { RequestWithUser } from "@interfaces/express.interface";
import ERROR_CODES from "@constants/error.const";

async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as IUserLogin;
    const user = await User.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      throwError(ERROR_CODES.AUTH_INVALID_EMAIL_OR_PASSWORD);
    }

    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) {
      throwError(ERROR_CODES.AUTH_INVALID_EMAIL_OR_PASSWORD);
    }

    const token = sign(
      {
        id: user.id,
        email: user.email,
      },
      envConfig.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res
      .status(StatusCodes.OK)
      .cookie("token", token, {
        httpOnly: true,
        secure: envConfig.NODE_ENV ==="production",
      })
      .json({
        message: "Login successful",
        data: {
          token,
        },
      });
  } catch (error) {
    res.status(error.httpStatus || StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: error.errorCode,
      message: error.message,
    });
  }
}

async function getCurrentUser(req: RequestWithUser, res: Response) {
  try {
    const user = req.user;

    res.status(StatusCodes.OK).json({
      message: "User found",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        gender: user.gender,
        isPremium: user.isPremium,
        location: user.location,
        preferredAgeMin: user.preferredAgeMin,
        preferredAgeMax: user.preferredAgeMax,
        preferredRange: user.preferredRange,
        photoId: user.photoId,
      },
    });
  } catch (error) {
    res.status(error.httpStatus || StatusCodes.ACCEPTED).json({
      message: error.message,
    });
  }
}

export default {
  login,
  getCurrentUser,
};
