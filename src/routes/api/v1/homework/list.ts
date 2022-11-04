import { Request, Response } from "express";
import HwBackend from "../../../../HwBackend";
import Homework from "../../../../misc/Homework";
import User from "../../../../misc/User";
import WebUtil from "../../../../WebUtil";

const list = (instance: HwBackend, user: User, req: Request, res: Response) => {
    let page: any = req.query.page;
    if (!page || isNaN(page)) {
        page = 0;
    }

    let copy: Homework[] = [];
    user.getHomework().forEach((hw) => {
        copy.push(hw);
    });

    copy.sort((a, b) => {
        return b.getCreated().getMilliseconds() - a.getCreated().getMilliseconds();
    });

    const pages = Math.ceil(copy.length / 10);
    const start = page * 10;
    const end = start + 10;
    const data = copy.slice(start, end);

    WebUtil.successData(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.OK, {
        pages: pages,
        data: data
    });

}

export default list;