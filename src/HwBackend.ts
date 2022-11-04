import pino from "pino";
import Webserver from "./Webserver";
import Storage from "./Storage";
import { PrismaClient } from "@prisma/client";

const config = require("../config/config.json");

export default class HwBackend {
    private logger: pino.BaseLogger;
    private webserver: Webserver;
    private prismaClient: PrismaClient;
    private storage: Storage;
    
    constructor() {
        this.logger = pino({
            transport: {
                target: "pino-pretty"
            }
        });

        this.logger.info("Starting hw-backend...");

        this.logger.info(`Creating prisma client...`);
        this.prismaClient = new PrismaClient();

        this.logger.info(`Creating storage...`);
        this.storage = new Storage(this);

        this.logger.info(`Starting webserver...`);
        this.webserver = new Webserver(this, config.host, config.port);
    }

    public getLogger(): pino.BaseLogger {
        return this.logger;
    }

    public getWebserver(): Webserver {
        return this.webserver;
    }

    public getPrismaClient(): PrismaClient {
        return this.prismaClient;
    }

    public getStorage(): Storage {
        return this.storage;
    }

}

new HwBackend();