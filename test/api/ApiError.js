"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ApiError class
 */
const services_1 = require("../services");
const DEFAULT_ERROR_STATUS = 500;
class ApiError extends services_1.ServiceError {
    // tslint:disable-next-line:no-any
    constructor(statusOrError, messageOrError, otherInfo) {
        let status;
        let error;
        let message;
        if (arguments.length === 1) {
            status = DEFAULT_ERROR_STATUS;
            error = statusOrError;
            super(error);
            this.status = status;
        }
        else if (arguments.length === 2 && typeof (messageOrError) === "string") {
            status = statusOrError;
            message = messageOrError;
            super(message, otherInfo);
            this.status = status;
        }
        else if (arguments.length === 2) {
            status = statusOrError;
            error = messageOrError;
            super(error);
            this.status = status;
        }
        else {
            status = statusOrError;
            message = messageOrError;
            super(message, otherInfo);
            this.status = status;
        }
    }
    toString() {
        return "Error " + this.name + "(" + this.status + "): " + this.message + (this.otherInfo ? " - " + JSON.stringify(this.otherInfo, null, 4) : "");
    }
}
exports.ApiError = ApiError;
exports.NO_USER_ERROR = new ApiError(500, "NoUserInRequest", "No user or no role in request");
exports.NO_AUTH_ERROR = new ApiError(401, "InsufficientRole", "Insufficient authorization for requested function");
exports.NO_USERS_FOUND = new ApiError(404, "NoUsersFound", "No users defined");
exports.NO_CURRENCY_FOUND = new ApiError(404, "NoCurrencyFound", "No currency defined");
exports.NOT_YET_IMPLEMENTED = new ApiError(501, "NotYetImplemented", "Function not yet implemented");
exports.INTERNAL_ERROR = new ApiError(500, "InternalError", "InternalError");
