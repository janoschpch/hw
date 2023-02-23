import { Request, Response } from "express";
import HwBackend from "../../../../HwBackend";
import User from "../../../../misc/User";
import WebUtil from "../../../../WebUtil";

const updateUserInfo = (instance: HwBackend, user: User, req: Request, res: Response) => {
    const { name, email } = req.body;

    if (name) {
        user.setName(name);
    }

    if (email) {
        user.setEmail(email);
    }

    instance.getStorage().updateUser(user).then(() => {
        WebUtil.successData(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.OK, {
            name: user.getName(),
            email: user.getEmail()
        });
    });
}

export default updateUserInfo;