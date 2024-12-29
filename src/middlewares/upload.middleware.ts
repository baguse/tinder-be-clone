import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "@constants/error.const";
import multer from "multer";

export function upload() {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "uploads");
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const fileExtension = file.originalname.split(".").pop();
          const fileName = `file-${uniqueSuffix}.${fileExtension}`;
          req.body.photoId = fileName;
          cb(null, fileName);
        },
      });

      const upload = multer({ storage: storage }).single("file");
      upload(req, res, (err) => {
        if (err) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: "File upload failed" });
        }
        next();
      });
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
