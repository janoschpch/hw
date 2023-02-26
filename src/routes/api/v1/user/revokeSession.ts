import { Request, Response } from "express";
import HwBackend from "../../../../HwBackend";
import User from "../../../../misc/User";
import WebUtil from "../../../../WebUtil";

const revokeSession = (instance: HwBackend, user: User, req: Request, res: Response) => {
    const { id } = req.body;

    if (!id) {
        WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.MISSING_PARAMETERS);
        return;
    }

    instance.getStorage().revokeSession(user, id).then(() => {
        WebUtil.success(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.OK);
    });
}

export default revokeSession;