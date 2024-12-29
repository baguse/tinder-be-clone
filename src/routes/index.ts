import { Router } from "express";

import UserRouter from "./user.route";
import AuthRouter from "./auth.route";
import MatchRouter from "./match.route";

const IndexRouter = Router();

IndexRouter.use("/users", UserRouter);
IndexRouter.use("/auth", AuthRouter);
IndexRouter.use("/matches", MatchRouter);

export default IndexRouter;
