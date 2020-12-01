import * as dotenv from 'dotenv';
dotenv.config();

type Config = {
  username: string,
  password: string,
  database: string,
  host: string,
  [key: string]: any,
}
interface IConfigGroup {
  development: Config;
  test: Config;
  production: Config;
}
const config: IConfigGroup = {
  "development": {
    "username": "root",
    "password": process.env.DB_PASSWORD!,
    "database": "msgamble",
    "host": "mariadb",
    "port": 3306,
    "dialect": "mysql",
    "dialectOptions": {
      "charset": "utf8mb4", 
      "dateStrings" : true, 
      "typeCast" : true 
    },
    "timezone": "+09:00",
  },
  "test": {
    "username": "root",
    "password": process.env.DB_PASSWORD!,
    "database": "msgamble",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "dialectOptions": {
      "charset": "utf8mb4", 
      "dateStrings" : true, 
      "typeCast" : true 
    },
    "timezone": "+09:00",
  },
  "production": {
    "username": "root",
    "password": process.env.DB_PASSWORD!,
    "database": "msgamble",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
};

export default config;