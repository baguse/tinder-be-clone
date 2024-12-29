import { Router } from "express";
import MatchController from "@controllers/match.controller";
import { validateToken } from "@middlewares/auth.middleware";

const UserRouter = Router();

UserRouter.get("/", validateToken(), MatchController.getMyMatches);


export default UserRouter;
