import ServerMessage from '../utils/ServerMessage.mjs';
import {Notification} from "../models/models.mjs";

const handler = async (err, req, res, next) => {
    if (err instanceof ServerMessage) {
        const {statusCode, message, event, data} = err;

        if (statusCode == 200 && event) {
            await Notification.create({
                userId: req.session?.user?._id,
                locationId: event._id,
                location: event.type,
                message,
                seen: false,
                updated: Date.now(),
            });
        }
        return res.status(statusCode).json({ message, data });
    }
    return res.status(500).json({ message: err });
}

export default handler;