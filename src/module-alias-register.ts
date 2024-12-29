import moduleAlias from "module-alias";
export const register = (): void => {
  moduleAlias.addAliases({
    "@models": `${__dirname}/models`,
    "@middlewares": `${__dirname}/middlewares`,
    "@interfaces": `${__dirname}/interfaces`,
    "@utils": `${__dirname}/utils`,
    "@controllers": `${__dirname}/controllers`,
    "@schemas": `${__dirname}/schemas`,
    "@types": `${__dirname}/types`,
    "@configurations": `${__dirname}/configurations`,
    "@app": `${__dirname}/app`,
    "@constants": `${__dirname}/constants`,
  });
};
