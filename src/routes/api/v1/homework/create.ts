import { Request, Response } from "express";
import HwBackend from "../../../../HwBackend";
import Homework from "../../../../misc/Homework";
import User from "../../../../misc/User";
import WebUtil from "../../../../WebUtil";

const create = (instance: HwBackend, user: User, req: Request, res: Response) => {
    const { subject, description, done } = req.body;
    if (!subject || !description || done == undefined) {
        WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.MISSING_PARAMETERS);
        return;
    }

    instance.getStorage().createHomework(user, subject, description, done).then((homework) => {
        WebUtil.successData(res, WebUtil.SuccessStatus.CREATED, WebUtil.SuccessType.CREATED, {
            id: homework.getId(),
            subject: homework.getSubject(),
            description: homework.getDescription(),
            done: homework.isDone(),
            created: homework.getCreated(),
        });
    });
}

export default create;