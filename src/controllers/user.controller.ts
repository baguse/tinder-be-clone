import { unlinkSync, existsSync } from "fs";

import User from "@models/user.model";
import { StatusCodes } from "http-status-codes";
import { genSaltSync, hashSync } from "bcryptjs";
import { Response, Request } from "express";
import { throwError } from "@utils/error.util";
import { RequestWithUser } from "@interfaces/express.interface";
import Match from "@models/match.model";
import { fn, Op, literal } from "sequelize";
import { endOfDay, startOfDay } from "date-fns";
import ERROR_CODES from "@constants/error.const";

async function createUser(req: Request, res: Response) {
  try {
    const body = req.body as User;
    const existingUser = await User.findOne({
      where: {
        email: body.email.toLowerCase(),
      },
    });

    if (existingUser) {
      throwError(ERROR_CODES.USER_ALREADY_EXISTS);
    }

    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    body.email = body.email.toLowerCase();

    const locationLngLat = (body.location as unknown as  number[]);
    const user = await User.create({
      ...body,
      location: fn("ST_GeomFromText", `POINT(${locationLngLat.join(" ")})`) as unknown as { type: string; coordinates: number[] },
    });

    res.status(StatusCodes.CREATED).json({
      message: "User created",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        gender: user.gender,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(error.httpStatus || StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: error.errorCode,
      message: error.message,
    });
  }
}

async function updateUser(req: RequestWithUser, res: Response) {
  try {
    const { user } = req;
    const body = req.body as User;

    let password;
    let location;
    let locationLngLat;
    let isPremium;
    if (body.password) {
      const salt = genSaltSync(10);
      password = hashSync(body.password, salt);
    }

    const {
      locationLng,
      locationLat,
    } = (body as unknown as  {
      locationLng: string;
      locationLat: string;
    });

    if (locationLng && locationLat) {
      locationLngLat = [Number(locationLng), Number(locationLat)];
      location = fn("ST_GeomFromText", `POINT(${(locationLngLat as unknown as number[]).join(" ")})`);
    }

    if (body.photoId) {
      const existingPhoto = user.photoId;
      if (existingPhoto && existsSync(`uploads/${existingPhoto}`)) {
        unlinkSync(`uploads/${existingPhoto}`);
      }
    }

    if (body.isPremium) {
      isPremium = (body.isPremium as unknown as string) === "true";
    }

    await user.update({
      ...body,
      password,
      location,
      isPremium,
    });

    res.status(StatusCodes.OK).json({
      message: "User updated",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        age: Number(user.age),
        gender: user.gender,
        ...(locationLngLat
          ? {
              location: {
                type: "Point",
                coordinates: locationLngLat,
              },
            }
          : {
              location: {
                type: "Point",
                coordinates: user.location.coordinates,
              },
            }),
        preferredRange: Number(user.preferredRange),
        preferredAgeMin: Number(user.preferredAgeMin),
        preferredAgeMax: Number(user.preferredAgeMax),
        photoId: user.photoId,
        isPremium: user.isPremium,
      },
    });
  } catch (error) {
    res.status(error.httpStatus || StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: error.errorCode,
      message: error.message,
    });
  }
}

async function getUserList(req: RequestWithUser, res: Response) {
  try {
    const { user } = req;
    let genderTarget = "MALE";
    if (user.gender === "MALE") {
      genderTarget = "FEMALE";
    }

    let maxTries = 10;
    if (user.isPremium) {
      maxTries = Infinity;
    }

    const now = new Date();
    const startOfDayDate = startOfDay(now);
    const endOfDayDate = endOfDay(now);

    const matches = await User.findAll({
      where: {
        gender: genderTarget,
      },
      attributes: {
        include: ["id"],
      },
      include: [
        {
          model: Match,
          as: "matchedMe",
          where: {
            userId1: user.id,
            createdAt: {
              [Op.lte]: endOfDayDate,
              [Op.gte]: startOfDayDate,
            },
          },
          required: true,
        },
      ],
    });

    if (matches.length >= maxTries) {
      // User has reached the limit and should wait until the next day or upgrade to premium
      throwError(ERROR_CODES.USER_CHANCES_LIMIT_REACHED);
    }

    const userIds = matches.map((match) => match.id);
    const [lng, lat] = user.location.coordinates;

    const location = literal(`ST_GeomFromText('POINT(${lng} ${lat})')`);
    const distanceFunc = fn("ST_Distance_Sphere", literal("location"), location);

    const unMatchedUsers = await User.findAll({
      where: {
        id: {
          [Op.notIn]: userIds,
        },
        gender: genderTarget,
        age: {
          [Op.gte]: user.preferredAgeMin,
          [Op.lte]: user.preferredAgeMax,
        },
        [Op.and]: [literal(`ST_Distance_Sphere(location, ST_GeomFromText('POINT(${lng} ${lat})')) <= ${user.preferredRange}`)],
      },
      attributes: ["id", "name", "photoId", "age", [distanceFunc, "distance"]],
      limit: 5,
    });

    if (unMatchedUsers.length === 0) {
      throwError(ERROR_CODES.USER_NO_MORE_MATCHES);
    }

    res.status(StatusCodes.OK).json({
      message: "Successfully fetched matches",
      data: unMatchedUsers,
    });
  } catch (error) {
    res.status(error.httpStatus || StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: error.errorCode,
      message: error.message,
    });
  }
}

async function passOrLikeUser(req: RequestWithUser, res: Response) {
  try {
    const { user: currentUser } = req;
    const { userId } = req.params;
    const status = req.params.status.toUpperCase();

    const targetUser = await User.findByPk(userId);

    if (!targetUser) {
      throwError(ERROR_CODES.USER_NOT_FOUND);
    }

    // Check if the user has passed the target user for today or already liked before
    const existingMatch = await Match.findOne({
      where: {
        userId1: currentUser.id,
        userId2: userId,
        [Op.or]: [
          {
            status: "LIKE",
          },
          {
            status: "PASS",
            createdAt: {
              [Op.gte]: startOfDay(new Date()),
              [Op.lte]: endOfDay(new Date()),
            },
          },
        ],
      },
    });

    if (existingMatch) {
      throwError(ERROR_CODES.USER_MATCH_ALREADY_EXISTS);
    }

    if (status === "LIKE") {
      // Check if the other user has liked the current user
      const existingMatch2 = await Match.findOne({
        where: {
          userId1: +userId,
          userId2: currentUser.id,
        },
      });

      if (existingMatch2) {
        // It's a match
        res.status(StatusCodes.OK).json({
          message: "It's a match",
          data: {
            isMatch: true,
          },
        });

        await existingMatch2.update({
          isMatch: true,
        });
        return;
      }
    }

    await Match.create({
      userId1: currentUser.id,
      userId2: +userId,
      status: status as "PASS" | "LIKE",
      isMatch: false,
    });

    res.status(StatusCodes.CREATED).json({
      message: "Match created",
      data: {
        isMatch: false,
      },
    });
  } catch (error) {
    res.status(error.httpStatus || StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: error.errorCode,
      message: error.message,
    });
  }
}

export default {
  createUser,
  getUserList,
  passOrLikeUser,
  updateUser,
};
