"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Routes config
 */
const logger = require("winston");
const typedi_1 = require("typedi");
const api_1 = require("../api");
const SERVICES = [];
function routesConfig() {
    // tslint:disable-next-line:no-any
    const app = typedi_1.Container.get("express");
    // push all services in array (to keep context live)
    SERVICES.push(
    //    new AuthService(),
    typedi_1.Container.get(api_1.UserServiceRouter), typedi_1.Container.get(api_1.CommonServiceRouter), typedi_1.Container.get(api_1.AccountServiceRouter));
    //
    logger.info("[SERVER] installing routers");
    for (const s of SERVICES) {
        app.use(s.getRouter());
    }
}
exports.routesConfig = routesConfig;
