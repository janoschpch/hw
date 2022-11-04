import { Request, Response } from "express";
import HwBackend from "../../../../HwBackend";
import User from "../../../../misc/User";
import WebUtil from "../../../../WebUtil";

const update = (instance: HwBackend, user: User, req: Request, res: Response) => {
    const { id, subject, description, done } = req.body;
    if (!subject || !description || done == undefined) {
        WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.MISSING_PARAMETERS);
        return;
    }

    let found: boolean = false;
    user.getHomework().forEach((homeworks) => {
        if (homeworks.getId() == id) {
            found = true;
            homeworks.setSubject(subject);
            homeworks.setDescription(description);
            homeworks.setDone(done);
            instance.getStorage().updateHomework(user, homeworks).then(() => {
                WebUtil.success(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.UPDATED);
            });
        }
    });

    if (!found) {
        WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.NOT_FOUND);
    }
}

export default update;