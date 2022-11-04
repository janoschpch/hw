import { Request, Response } from "express";
import HwBackend from "../../../../HwBackend";
import WebUtil from "../../../../WebUtil";

const login = (instance: HwBackend, req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.MISSING_PARAMETERS);
        return;
    }

    instance.getStorage().userExists(email).then((exists) => {
        if (!exists) {
            WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.WRONG_CREDENTIALS);
            return;
        }

        instance.getStorage().getUserByMail(email).then((user) => {
            if (user?.getPasswordHash() !== password || !user) {
                WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.WRONG_CREDENTIALS);
                return;
            }

            const date = new Date();
            date.setDate(date.getDate() + 30);

            instance.getStorage().createSession(user, date).then((session) => {
                res.cookie("session", session, {
                    expires: date
                });
                WebUtil.success(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.LOGGED_IN);
            });
        });
    });
}

export default login;