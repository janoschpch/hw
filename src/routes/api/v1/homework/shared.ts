import { Request, Response } from "express";
import HwBackend from "../../../../HwBackend";
import User from "../../../../misc/User";
import WebUtil from "../../../../WebUtil";

const shared = (instance: HwBackend, req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) {
        WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.MISSING_PARAMETERS);
        return;
    }

    instance.getStorage().getSharedHomework(token).then((homework: any) => {
        if (homework) {
            WebUtil.successData(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.OK, {
                subject: homework.subject,
                description: homework.description,
                created: homework.createdAt,
                user: homework.user.name,
            });
        } else {
            WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.NOT_FOUND);
        }
    });
}

export default shared;