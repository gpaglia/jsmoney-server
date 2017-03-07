/**
 * Server main module
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rootDir = __dirname;
const logger = require("winston");
// This is a global singleton
require("reflect-metadata");
const typedi_1 = require("typedi");
typedi_1.Container.provide([{
        name: "ROOT_DIR",
        type: String,
        value: rootDir
    }]);
// import { Config } from "./_singletons/Config";
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
const server = typedi_1.Container.get(MainServer_1.MainServer);
server.run();
