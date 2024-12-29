import { sequelize } from "@configurations/database.config";

import User from "./user.model";
import Match from "./match.model";

const init = async () => {
  try {
    if (process.env.NODE_ENV !== "test") {
      await sequelize.authenticate();
    }
    sequelize.addModels([
      User,
      Match,
    ]);

    // sequelize.sync({
    //   alter: true,
    // });
    // eslint-disable-next-line no-console
    console.log("Connection has been established successfully.");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Unable to connect to the database:", error);
  }
};

export default { init };
