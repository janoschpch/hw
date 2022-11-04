import mysql from "mysql";
import HwBackend from "./index";

export default class Database {
    pool: mysql.Pool;

    constructor(instance: HwBackend, host: string, port: number, user: string, password: string) {
        this.pool = mysql.createPool({
            host: host,
            port: port,
            user: user,
            password: password,
            connectionLimit: 10
        });
    }
}