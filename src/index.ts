import pino from "pino";
import Database from "./database";
import Webserver from "./webserver";

const mysqlConfig = require("../config/mysql.json");
const config = require("../config/config.json");

export default class HwBackend {
    logger: pino.BaseLogger | any = null;
    database: Database | null = null;
    webserver: Webserver | null = null;
    
    constructor() {
        this.logger = pino({
            transport: {
                target: "pino-pretty"
            }
        });
    }

    run() {
        this.logger.info("Starting hw-backend...");

        this.logger.info(`Connecting to mysql database... (${mysqlConfig.host}:${mysqlConfig.port})`);
        this.database = new Database(this, mysqlConfig.host, mysqlConfig.port, mysqlConfig.user, mysqlConfig.password);

        this.logger.info(`Starting webserver...`);
        this.webserver = new Webserver(this, config.host, config.port);

    }
}

new HwBackend().run();