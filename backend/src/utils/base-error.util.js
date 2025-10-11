export class BaseError extends Error {
    constructor(statusCode = 500, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}
