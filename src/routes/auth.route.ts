import { Router } from "express";
import AuthController from "@controllers/auth.controller";
import { validateBody } from "@middlewares/validateSchema.middleware";
import { validateToken } from "@middlewares/auth.middleware";
import { UserLoginSchema } from "@schemas/user.schema";

const AuthRouter = Router();

AuthRouter.post("/login", validateBody(UserLoginSchema), AuthController.login);
AuthRouter.get("/me", validateToken(), AuthController.getCurrentUser);

export default AuthRouter;
