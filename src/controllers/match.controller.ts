import User from "@models/user.model";
import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import { RequestWithUser } from "@interfaces/express.interface";
import Match from "@models/match.model";
import { Op } from "sequelize";

async function getMyMatches(req: RequestWithUser, res: Response) {
  try {
    const { user } = req;

    // premium user will see all matches or likes from other users
    const premiumFilter = {
      [Op.or]: [
        {
          isMatch: true,
          [Op.or]: [
            { userId1: user.id },
            { userId2: user.id },
          ],
        },
        {
          userId2: user.id,
          status: "LIKE",
        },
      ],
    };

    const matches = await Match.findAll({
      where: {
        ...(user.isPremium ? premiumFilter : {
          isMatch: true,
          [Op.or]: [
            { userId1: user.id },
            { userId2: user.id },
          ],
        }),
      },
      include: [
        {
          model: User,
          as: "user2",
          attributes: {
            exclude: ["password", "email", "location", "preferredAgeMin", "preferredAgeMax", "preferredRange", "isPremium"],
          },
        },
      ],
    });

    res.status(StatusCodes.OK).json({
      message: "Successfully fetched matches",
      data: matches,
    });
  } catch (error) {
    res.status(error.httpStatus || StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: error.errorCode,
      message: error.message,
    });
  }
}

export default {
  getMyMatches,
};
