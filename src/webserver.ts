import express from "express";
import http from "http";
import HwBackend from "./index";

export default class Webserver {
    app: Express.Application;
    server: http.Server;

    constructor(instance: HwBackend, host: string, port: number) {
        this.app = express();
        this.server = http.createServer(this.app);
        
        this.server.listen(port, host, () => {
            instance.logger.info(`Webserver running on ${host}:${port}`);
        });
    }


}