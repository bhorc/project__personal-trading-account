class ServerMessage extends Error {
    constructor(statusCode, message, event, data) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.event = event;
        this.data = data;
    }
    static success(message, event, data) {
        return new ServerMessage(200, message, event, data);
    }
    static badRequest(message) {
        return new ServerMessage(400, message);
    }
    static unauthorized(message) {
        return new ServerMessage(401, message);
    }
    static forbidden(message) {
        return new ServerMessage(403, message);
    }
    static notFound(message) {
        return new ServerMessage(404, message);
    }
    static conflict(message) {
        return new ServerMessage(409, message);
    }
    static serverError(message) {
        return new ServerMessage(500, message);
    }
}

export default ServerMessage;