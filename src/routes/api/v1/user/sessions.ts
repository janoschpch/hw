import { Request, Response } from "express";
import UAParser from "ua-parser-js";
import HwBackend from "../../../../HwBackend";
import User from "../../../../misc/User";
import WebUtil from "../../../../WebUtil";

const sessions = async (instance: HwBackend, user: User, req: Request, res: Response) => {
    let sessions = await instance.getStorage().getSessions(user);
    WebUtil.successData(res, WebUtil.SuccessStatus.OK, WebUtil.SuccessType.OK, {
        sessions: sessions.map(session => {
            return {
                id: session.id,
                expiresAt: session.expiresAt,
                active: session.lastUsed > Date.now() - 1000 * 60 * 60 * 24 * 7,
                ip: session.ip,
                agent: new UAParser(session.deviceInfo).getResult(),
            }
        })
    });
}

export default sessions;