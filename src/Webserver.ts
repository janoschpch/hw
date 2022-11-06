import express, { Request, Response } from "express";
import http from "http";
import path from "path";
import HwBackend from "./HwBackend";
import WebUtil from "./WebUtil";

export default class Webserver {
    app: any;
    server: http.Server;
    instance: HwBackend;

    constructor(instance: HwBackend, host: string, port: number) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.instance = instance;
        
        this.app.use(express.json());
        
        this.server.listen(port, host, () => {
            instance.getLogger().info(`Webserver running on ${host}:${port}`);
        });

        // AUTH ROUTES
        this.app.get("/api/v1/", (req: Request, res: Response) => require("./routes/api/v1/index").default(instance, req, res));
        this.app.post("/api/v1/auth/login", (req: Request, res: Response) => require("./routes/api/v1/auth/login").default(instance, req, res));
        this.app.post("/api/v1/auth/logout", (req: Request, res: Response) => require("./routes/api/v1/auth/logout").default(instance, req, res));
        if (instance.getConfig().allowRegistration) {
            this.app.post("/api/v1/auth/register", (req: Request, res: Response) => require("./routes/api/v1/auth/register").default(instance, req, res));
        }

        // USER ROUTES
        this.registerAuthenticatedGetRoute("/api/v1/user/userInfo", (instance, user, req, res) => require("./routes/api/v1/user/userInfo").default(instance, user, req, res));

        // HOMEWORK ROUTES
        this.registerAuthenticatedGetRoute("/api/v1/homework/list", (instance, user, req, res) => require("./routes/api/v1/homework/list").default(instance, user, req, res));
        this.registerAuthenticatedPostRoute("/api/v1/homework/create", (instance, user, req, res) => require("./routes/api/v1/homework/create").default(instance, user, req, res));
        this.registerAuthenticatedPostRoute("/api/v1/homework/delete", (instance, user, req, res) => require("./routes/api/v1/homework/delete").default(instance, user, req, res));
        this.registerAuthenticatedPostRoute("/api/v1/homework/update", (instance, user, req, res) => require("./routes/api/v1/homework/update").default(instance, user, req, res));

        // WEB APP ROUTES
        this.app.use(express.static(path.join(__dirname, "../app/build/")));
        this.app.get("/*", (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, "../app/build/index.html"));
        });
    }

    registerAuthenticatedPostRoute(path: string, callback: (instance: HwBackend, user: any, req: Request, res: Response) => void) {
        this.app.post(path, (req: Request, res: Response) => {
            const session = req.headers.authorization;
            if (!session) {
                WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.MISSING_PARAMETERS);
                return;
            }

            this.instance.getStorage().getSession(session).then((user) => {
                if (!user) {
                    WebUtil.error(res, WebUtil.ErrorStatus.UNAUTHORIZED, WebUtil.ErrorType.INVALID_SESSION);
                    return;
                }

                callback(this.instance, user, req, res);
            });
        });
    }

    registerAuthenticatedGetRoute(path: string, callback: (instance: HwBackend, user: any, req: Request, res: Response) => void) {
        this.app.get(path, (req: Request, res: Response) => {
            const session = req.headers.authorization;
            if (!session) {
                WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.MISSING_PARAMETERS);
                return;
            }

            this.instance.getStorage().getSession(session).then((user) => {
                if (!user) {
                    WebUtil.error(res, WebUtil.ErrorStatus.UNAUTHORIZED, WebUtil.ErrorType.INVALID_SESSION);
                    return;
                }

                callback(this.instance, user, req, res);
            });
        });
    }


}