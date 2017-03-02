"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * AbstractServiceRouter class
 */
const logger = require("winston");
const typedi_1 = require("typedi");
const express_1 = require("express");
const Config_1 = require("../_singletons/Config");
const jsmoney_server_api_1 = require("jsmoney-server-api");
const ApiError_1 = require("./ApiError");
let AbstractServiceRouter = class AbstractServiceRouter {
    constructor() {
        this.router = express_1.Router();
        this.configData = Config_1.Config.getConfigData();
        this.connection = Config_1.Config.getConnection();
        this.doConfig();
    }
    getRouter() {
        return this.router;
    }
    apiPath(path) {
        return this.configData.api.base + this.configData.api.version + path;
    }
    requireAdministrator() {
        return this.requireRole(jsmoney_server_api_1.Role.administrator);
    }
    requireUser() {
        return this.requireRole(jsmoney_server_api_1.Role.user);
    }
    requireGuest() {
        return this.requireRole(jsmoney_server_api_1.Role.guest);
    }
    requireRole(role) {
        return (req, res, next) => {
            const user = req.user;
            logger.debug("[SERVER] requireRole: " + role + " , user: " + JSON.stringify(user, null, 4));
            if (!user || !user.role) {
                res.status(ApiError_1.NO_USER_ERROR.status).json(ApiError_1.NO_USER_ERROR);
            }
            else if (user.role >= role) {
                next();
            }
            else {
                res.status(ApiError_1.NO_AUTH_ERROR.status).json(ApiError_1.NO_AUTH_ERROR);
            }
        };
    }
};
AbstractServiceRouter = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], AbstractServiceRouter);
exports.AbstractServiceRouter = AbstractServiceRouter;
