/**
 * ServiceError class
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-any
class ServiceError {
    constructor(messageOrError, otherInfo) {
        this.name = this.constructor.name;
        if (arguments.length === 1) {
            const error = messageOrError;
            this.message = error.message;
            this.otherInfo = error.otherInfo;
        }
        else {
            this.message = messageOrError;
            this.otherInfo = otherInfo;
        }
    }
    toString() {
        return "Error " + this.name + ": " + this.message + (this.otherInfo ? " - " + JSON.stringify(this.otherInfo, null, 4) : "");
    }
}
exports.ServiceError = ServiceError;
