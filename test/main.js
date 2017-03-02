/**
 * Server main module
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:export-name
exports.rootDir = __dirname;
const logger = require("winston");
// This is a global singleton
require("reflect-metadata");
const typedi_1 = require("typedi");
const Config_1 = require("./_singletons/Config");
const typeorm_1 = require("typeorm");
// import { useContainer as validatorUseContainer } from "class-validator";
const MainServer_1 = require("./startup/MainServer");
// Init container with typeorm and class-validator
typeorm_1.useContainer(typedi_1.Container);
// const connectionManager = Container.get<ConnectionManager>(ConnectionManager);
// validatorUseContainer(Container);
// const validator = Container.get(Validator);
logger.configure({
    level: "debug",
    transports: [
        new logger.transports.Console()
    ]
});
console.log("=== 1", Config_1.Config.getConfigData());
const server = typedi_1.Container.get(MainServer_1.MainServer);
console.log("=== 2", Config_1.Config.getConfigData());
server.run();
