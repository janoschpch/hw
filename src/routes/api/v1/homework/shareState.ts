import { Request, Response } from "express";
import HwBackend from "../../../../HwBackend";
import User from "../../../../misc/User";
import WebUtil from "../../../../WebUtil";

const shareState = (instance: HwBackend, user: User, req: Request, res: Response) => {
    const { id } = req.body;
    if (!id) {
        WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.MISSING_PARAMETERS);
        return;
    }

    let found: boolean = false;
    user.getHomework().forEach((homeworks) => {
        if (homeworks.getId() == id) {
            found = true;

            instance.getStorage().hasBeenSharedBefore(user, homeworks).then((shared) => {
                if (!shared) {
                    instance.getStorage().setShared(user, homeworks, true).then((accessToken) => {
                        WebUtil.successData(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.OK, {
                            accessToken: accessToken,
                            shared: true
                        });
                    });
                } else {
                    instance.getStorage().isShared(user, homeworks).then((shared) => {
                        WebUtil.successData(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.OK, {
                            accessUrl: instance.getConfig().productionUrl + "/share/" + shared.accessToken,
                            shared: shared.shared
                        });
                    });
                }
            });
        }
    });

    if (!found) {
        WebUtil.error(res, WebUtil.ErrorStatus.BAD_REQUEST, WebUtil.ErrorType.NOT_FOUND);
    }
}

export default shareState;