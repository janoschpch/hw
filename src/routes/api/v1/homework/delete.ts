import { Request, Response } from "express";
import HwBackend from "../../../../HwBackend";
import User from "../../../../misc/User";
import WebUtil from "../../../../WebUtil";

const deleteHomework = (instance: HwBackend, user: User, req: Request, res: Response) => {
    const { id } = req.body;
    if (!id) {
        WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.MISSING_PARAMETERS);
        return;
    }

    let found: boolean = false;
    user.getHomework().forEach((homeworks) => {
        if (homeworks.getId() == id) {
            found = true;
            instance.getStorage().deleteHomework(user, homeworks).then(() => {
                WebUtil.success(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.DELETED);
            });
        }
    });

    if (!found) {
        WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.NOT_FOUND);
    }
}

export default deleteHomework;