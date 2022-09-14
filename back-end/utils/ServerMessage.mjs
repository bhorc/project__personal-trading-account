class ServerMessage extends Error {
    constructor(statusCode, message, data, event) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.event = event;
    }
    static success(message, data, event) {
        return new ServerMessage(200, message, data, event);
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