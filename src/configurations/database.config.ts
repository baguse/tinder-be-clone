
import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";

// eslint-disable-next-line typescript-paths/absolute-parent-import
import envConfig from "../utils/envConfig.util";

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_DIALECT,
} = envConfig;

const config: Record<string, {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect?: string;
  seederStorage?: "json" | "sequelize";
}> = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: +DB_PORT,
    dialect: DB_DIALECT,
    seederStorage: "sequelize",
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: +DB_PORT,
    dialect: DB_DIALECT,
    seederStorage: "sequelize",
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: +DB_PORT,
    dialect: DB_DIALECT,
    seederStorage: "sequelize",
  },
};

const currentConfig = config[process.env.NODE_ENV || "development"];

const sequelize = new Sequelize({
  dialect: currentConfig.dialect as Dialect,
  host: currentConfig.host,
  port: currentConfig.port,
  username: currentConfig.username,
  password: currentConfig.password,
  database: currentConfig.database,
});
export {
  sequelize,
};

export const development = config.development;
export const test = config.test;
export const production = config.production;

export default config;
