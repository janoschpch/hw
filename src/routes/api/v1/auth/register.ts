import { Request, Response } from "express";
import HwBackend from "../../../../HwBackend";
import WebUtil from "../../../../WebUtil";

const register = (instance: HwBackend, req: Request, res: Response) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.MISSING_PARAMETERS);
        return;
    }

    instance.getStorage().userExists(email).then((exists) => {
        if (exists) {
            WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.EXISTS_ALREADY);
            return;
        }

        instance.getStorage().createUser(username, email, password).then(() => {
            WebUtil.success(res, WebUtil.SuccessStatus.CREATED, WebUtil.SuccessType.CREATED);
        });
    });
}

export default register;