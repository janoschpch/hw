import { Request, Response } from "express";
import HwBackend from "../../../../HwBackend";
import Homework from "../../../../misc/Homework";
import User from "../../../../misc/User";
import WebUtil from "../../../../WebUtil";

const list = async (instance: HwBackend, user: User, req: Request, res: Response) => {
    if (user.getRole() !== "ADMIN") {
        WebUtil.error(res, WebUtil.ErrorStatus.FORBIDDEN, WebUtil.ErrorType.NO_PERMISSION);
        return;
    }

    let page: any = req.query.page;
    if (!page || isNaN(page)) {
        page = 0;
    }

    let count = await instance.getPrismaClient().homework.count();

    const pages = Math.ceil(count / 10);
    const start = page * 10;

    let copy: any[] = [];
    await instance.getPrismaClient().user.findMany({
        take: 10,
        skip: start,
    }).then((users) => {
        users.forEach((user) => {
            copy.push({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        });
    });


    WebUtil.successData(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.OK, {
        pages: pages,
        data: copy
    });
}

export default list;