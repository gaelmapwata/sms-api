import dotenv from 'dotenv';
import { Dialect } from 'sequelize';
import { env } from 'process';

dotenv.config();

let username; let password; let database; let host; let port; let dialect;

if (env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  let url = process.env.DATABASE_URL;
  [dialect, url] = url.split('://');
  [username] = url.split('@')[0].split(':');
  [, password] = url.split('@')[0].split(':');
  [host, url] = url.split('@')[1].split(':');
  [port, database] = url.split('/');
}

export const development = {
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT as Dialect,
  dialectOptions: {
    bigNumberStrings: true,
  },
  logging: false,
  seederStorage: 'sequelize',
};
export const test = {
  username: process.env.CI_DB_USERNAME,
  password: process.env.CI_DB_PASSWORD,
  database: process.env.CI_DB_NAME,
  host: process.env.CI_DB_HOST,
  port: 3306,
  dialect: process.env.CI_DB_HOST as Dialect,
  dialectOptions: {
    bigNumberStrings: true,
  },
};
export const production = {
  username: username || process.env.DB_USER_NAME,
  password: password || process.env.DB_PASSWORD,
  database: database || process.env.DB_NAME,
  host: host || process.env.DB_HOST,
  port: port || process.env.DB_PORT,
  dialect: (dialect || process.env.DB_DIALECT) as Dialect,
  dialectOptions: {
    bigNumberStrings: true,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  logging: false,
  seederStorage: 'sequelize',
};
