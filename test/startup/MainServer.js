"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Main config file for server
 */
// This is a global singleton
require("reflect-metadata");
const logger = require("winston");
const typedi_1 = require("typedi");
const Config_1 = require("../_singletons/Config");
const appDataConfig_1 = require("./appDataConfig");
const expressConfig_1 = require("./expressConfig");
const dbConfig_1 = require("./dbConfig");
let MainServer = class MainServer {
    constructor() {
        // tslint:disable-next-line:no-any
        this.configData = Config_1.Config.getConfigData();
    }
    run() {
        logger.info("[SERVER] Starting server initialization, log level: " + logger.level);
        const dbName = this.configData.database.name;
        logger.info("[SERVER] Test database:name = " + dbName);
        const c2 = typedi_1.Container.get(Config_1.Config);
        logger.info("[SERVER] Test2 database:name = " + c2.data().database.name);
        // Initialize Modules
        Promise.resolve()
            .then(() => {
            return dbConfig_1.dbConfig();
        })
            .then(() => {
            return appDataConfig_1.appDataConfig();
        })
            .then(() => {
            return expressConfig_1.expressConfig();
        })
            .catch((err) => {
            logger.error("[SERVER] initialization failed... ", err);
        });
    }
};
MainServer = __decorate([
    typedi_1.Service()
], MainServer);
exports.MainServer = MainServer;
