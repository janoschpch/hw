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

            const deviceInfo = req.headers["user-agent"] || "Generic Device";
            const ip: any = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

            instance.getStorage().createSession(user, date, deviceInfo, ip).then((session) => {
                WebUtil.successData(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.LOGGED_IN, {
                    token: session,
                    expires: date,
                });
            });
        });
    });
}

export default login;