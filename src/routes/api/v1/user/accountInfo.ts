import { Request, Response } from "express";
import HwBackend from "../../../../HwBackend";
import User from "../../../../misc/User";
import WebUtil from "../../../../WebUtil";

const accountInfo = async (instance: HwBackend, user: User, req: Request, res: Response) => {
    let sessions = await instance.getPrismaClient().session.findMany({
        where: {
            userId: user.getId()
        }
    });

    WebUtil.successData(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.OK, {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        homeworks: user.getHomework(),
        sessions: sessions.map(session => {
            return {
                id: session.id,
                expiresAt: session.expiresAt,
                deviceInfo: session.deviceInfo,
            }
        })
    });
}

export default accountInfo;