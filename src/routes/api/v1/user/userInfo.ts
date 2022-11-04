import { Request, Response } from "express";
import HwBackend from "../../../../HwBackend";
import User from "../../../../misc/User";
import WebUtil from "../../../../WebUtil";

const userInfo = (instance: HwBackend, user: User, req: Request, res: Response) => {
    WebUtil.successData(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.OK, {
        name: user.getName(),
        email: user.getEmail()
    });
}

export default userInfo;