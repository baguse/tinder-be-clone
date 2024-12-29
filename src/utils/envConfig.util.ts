import dotEnv from "dotenv";

dotEnv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
const prefixMap: {
  [key: string]: string;
} = {
  development: "DEV",
  test: "TEST",
  production: "PROD",
};

const prefix = prefixMap[NODE_ENV];

const envConfig = {
  NODE_ENV,
  PORT: process.env[`${prefix}_PORT`] || "3000",
  DB_USERNAME: process.env[`${prefix}_DB_USERNAME`] || "baguse",
  DB_PASSWORD: process.env[`${prefix}_DB_PASSWORD`] || "baguse",
  DB_HOST: process.env[`${prefix}_DB_HOST`] || "localhost",
  DB_PORT: process.env[`${prefix}_DB_PORT`] || "5432",
  DB_NAME: process.env[`${prefix}_DB_NAME`] || "baguse",
  DB_DIALECT: process.env[`${prefix}_DB_DIALECT`] || "postgres",
  JWT_SECRET: process.env[`${prefix}_JWT_SECRET`] || "osifhdwei9fhw0iefhwe0ifhwef",
};

export default envConfig;
