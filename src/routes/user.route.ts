import { Router } from "express";
import UserController from "@controllers/user.controller";
import { validateBody } from "@middlewares/validateSchema.middleware";
import { UserCreateSchema, UserUpdateSchema } from "@schemas/user.schema";
import { validateToken } from "@middlewares/auth.middleware";
import { upload } from "@middlewares/upload.middleware";

const UserRouter = Router();

UserRouter.post("/", validateBody(UserCreateSchema), UserController.createUser);
UserRouter.get("/", validateToken(), UserController.getUserList);
UserRouter.post("/:userId/:status", validateToken(), UserController.passOrLikeUser);
UserRouter.patch("/", validateToken(), upload(), validateBody(UserUpdateSchema), UserController.updateUser);


export default UserRouter;
