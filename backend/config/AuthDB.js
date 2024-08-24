/**
 * @file AuthDB Users' database configuration file
 */
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// Credentials of DB
const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT

// Connection to DB (AUTH_DB)
const db = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "mysql"
});
 
export default db;