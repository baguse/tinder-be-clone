// eslint-disable-next-line @typescript-eslint/no-require-imports
require("./module-alias-register").register();

import envConfig from "@utils/envConfig.util";

import App from "./app";

App.listen(envConfig.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://localhost:${envConfig.PORT}`);
});
