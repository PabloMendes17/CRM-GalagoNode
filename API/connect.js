import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config({path:"./.env"});

export const db = mysql.createConnection({

    host: process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
});