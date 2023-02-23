import { Request, Response } from "express";
import HwBackend from "../../../../HwBackend";
import User from "../../../../misc/User";
import WebUtil from "../../../../WebUtil";

const share = (instance: HwBackend, user: User, req: Request, res: Response) => {
    const { id, shared } = req.body;
    if (!id || shared == undefined) {
        WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.MISSING_PARAMETERS);
        return;
    }

    let found: boolean = false;
    user.getHomework().forEach((homeworks) => {
        if (homeworks.getId() == id) {
            found = true;

            instance.getStorage().setShared(user, homeworks, shared).then((accessToken) => {
                WebUtil.successData(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.OK, {
                    accessToken: accessToken,
                    shared: shared
                });
            });
        }
    });

    if (!found) {
        WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.NOT_FOUND);
    }
}

export default share;