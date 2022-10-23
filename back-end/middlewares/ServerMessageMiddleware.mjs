import ServerMessageService from '../services/ServerMessageService.mjs';
// import { Notification } from '../models/Models.mjs';

const handler = async (err, req, res, next) => {
  if (err instanceof ServerMessageService) {
    const {
      statusCode, message, data,
    } = err;
    /* if (statusCode === 200 && event) {
      await Notification.create({
        userId: req.session?.user?._id,
        locationId: event._id,
        location: event.type,
        message,
        seen: false,
      });
    } */
    return res.status(statusCode).json({ message, data });
  }
  return res.status(500).json({ message: err });
};

export default handler;
