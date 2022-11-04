import { Request, Response } from "express";
import HwBackend from "../../../../HwBackend";
import WebUtil from "../../../../WebUtil";

const logout = (instance: HwBackend, req: Request, res: Response) => {
    const session = req.body.session;
    if (!session) {
        WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.MISSING_PARAMETERS);
        return;
    }

    instance.getStorage().deleteSession(session).then(() => {
        WebUtil.success(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.LOGGED_OUT);
    });
}

export default logout;