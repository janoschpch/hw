import { Request, Response } from "express";
import HwBackend from "../../../HwBackend";

const packageJson = require("../../../../package.json");

const index = (instance: HwBackend, req: Request, res: Response) => {
    res.send({
        status: "success",
        message: "hw api v1 running",
        data: {
            name: packageJson.name,
            version: packageJson.version
        }
    });
}

export default index;