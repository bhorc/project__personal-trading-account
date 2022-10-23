class ServerMessageService extends Error {
  constructor(statusCode, message, data) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
  static success(message, data) {
    return new ServerMessageService(200, message, data);
  }
  static badRequest(message) {
    return new ServerMessageService(400, message);
  }
  static unauthorized(message) {
    return new ServerMessageService(401, message);
  }
  static forbidden(message) {
    return new ServerMessageService(403, message);
  }
  static notFound(message) {
    return new ServerMessageService(404, message);
  }
  static conflict(message) {
    return new ServerMessageService(409, message);
  }
  static serverError(message) {
    return new ServerMessageService(500, message);
  }
}

export default ServerMessageService;
