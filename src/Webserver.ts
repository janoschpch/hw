import express from "express";
import http from "http";
import HwBackend from "./HwBackend";

export default class Webserver {
    app: Express.Application;
    server: http.Server;

    constructor(instance: HwBackend, host: string, port: number) {
        this.app = express();
        this.server = http.createServer(this.app);
        
        this.server.listen(port, host, () => {
            instance.getLogger().info(`Webserver running on ${host}:${port}`);
        });
    }


}