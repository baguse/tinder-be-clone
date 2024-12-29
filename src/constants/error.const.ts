import { StatusCodes } from "http-status-codes";
const ERROR_CODES = {
  // Auth
  AUTH_INVALID_EMAIL_OR_PASSWORD: {
    message: "Invalid email or password",
    httpStatus: StatusCodes.UNAUTHORIZED,
    errorCode: "AUTH_INVALID_EMAIL_OR_PASSWORD",
  },
  AUTH_UNAUTHORIZED: {
    message: "Unauthorized",
    httpStatus: StatusCodes.UNAUTHORIZED,
    errorCode: "AUTH_UNAUTHORIZED",
  },
  // User
  USER_ALREADY_EXISTS: {
    message: "User already exists",
    httpStatus: StatusCodes.CONFLICT,
    errorCode: "USER_ALREADY_EXISTS",
  },
  USER_CHANCES_LIMIT_REACHED: {
    message: "User chances limit reached",
    httpStatus: StatusCodes.FORBIDDEN,
    errorCode: "USER_CHANCES_LIMIT_REACHED",
  },
  USER_NO_MORE_MATCHES: {
    message: "No more matches",
    httpStatus: StatusCodes.NOT_FOUND,
    errorCode: "USER_NO_MORE_MATCHES",
  },
  USER_NOT_FOUND: {
    message: "User not found",
    httpStatus: StatusCodes.NOT_FOUND,
    errorCode: "USER_NOT_FOUND",
  },
  USER_MATCH_ALREADY_EXISTS: {
    message: "Match already exists",
    httpStatus: StatusCodes.CONFLICT,
    errorCode: "USER_MATCH_ALREADY_EXISTS",
  },
  INVALID_PAYLOAD: {
    message: "Invalid payload",
    httpStatus: StatusCodes.BAD_REQUEST,
    errorCode: "INVALID_PAYLOAD",
  },
};

export default ERROR_CODES;
