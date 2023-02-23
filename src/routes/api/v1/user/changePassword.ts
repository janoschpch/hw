import { Request, Response } from "express";
import HwBackend from "../../../../HwBackend";
import User from "../../../../misc/User";
import WebUtil from "../../../../WebUtil";

const changePassword = (instance: HwBackend, user: User, req: Request, res: Response) => {
    const { password } = req.body;

    if (!password) {
        WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.MISSING_PARAMETERS);
        return;
    }

    user.setPasswordHash(password);

    instance.getStorage().updateUser(user).then(() => {
        WebUtil.success(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.OK);
    });
}

export default changePassword;