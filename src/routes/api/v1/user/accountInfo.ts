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

    let shared = await instance.getPrismaClient().shared.findMany({
        where: {
            userId: user.getId()
        }
    });

    WebUtil.successData(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.OK, {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        role: user.getRole(),
        homeworks: user.getHomework(),
        shared: shared.map(share => {
            return {
                id: share.id,
                homeworkId: share.homeworkId,
                accessToken : share.accessToken,
                isShared: share.isShared
            }
        }),
        sessions: sessions.map(session => {
            return {
                id: session.id,
                expiresAt: session.expiresAt,
                deviceInfo: session.deviceInfo,
                lastUsed: session.lastUsed,
                ip: session.ip,
            }
        }),
    });
}

export default accountInfo;