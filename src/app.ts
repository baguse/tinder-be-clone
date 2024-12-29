import cookieParser from "cookie-parser";
import Express from "express";
import Morgan from "morgan";

import Router from "./routes";
import model from "./models";

model.init();

const App = Express();
App.use(Express.json());
App.use(Express.urlencoded({ extended: true }));
App.use(cookieParser());
App.use(Morgan("dev"));
App.use("/uploads", Express.static("uploads"));

App.use("/api/v1", Router);

export default App;
