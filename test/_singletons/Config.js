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
 * Config sigleton
 */
const main_1 = require("../main");
const nconf = require("nconf");
const logger = require("winston");
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
// tslint:disable:no-any
const env = process.env.NODE_ENV;
const path = main_1.rootDir + "/config/_app/";
let Config = Config_1 = class Config {
    constructor() {
        // Instance method
        this.data = () => {
            // console.log("Config data is ", this._config);
            return this._config;
        };
        console.log("Config constructor ", path, env);
        logger.debug("[SERVER] Config initializing, path is " + path);
        if (Config_1._instance) {
            logger.error("[SERVER] Trying to initialize config multiple times");
            throw ("Config already initialized");
        }
        // Fixed, non configurable data
        nconf.overrides({});
        // Process env and argv
        nconf.env().argv();
        logger.debug("[SERVER] Config initializing, env is " + env);
        nconf.file("specific", path + env + ".config.json");
        nconf.file("common", path + "common.config.json");
        nconf.defaults({});
        this._config = nconf.get(undefined);
        logger.debug("[SERVER] Config object: " + JSON.stringify(this._config, null, 4));
    }
    /*
      public static data(): any {
        if (!Config._instance) {
          // this will load the config data
          Config._instance = new Config();
          Container.set(Config, Config._instance);
        }
        return Config._instance._config;
      }
    */
    /*
      public static loadConfig(): any {
        Config.data();
      }
    */
    static getConfigData() {
        const config = typedi_1.Container.get(Config_1);
        return config.data();
    }
    static getConnectionManager() {
        return typedi_1.Container.get(typeorm_1.ConnectionManager);
    }
    static getConnection(name) {
        if (!name) {
            name = Config_1.getConfigData().database.name;
        }
        return Config_1.getConnectionManager().get(name);
    }
    static getEntityManager(name) {
        return Config_1.getConnection(name).entityManager;
    }
    static getRepository(nameOrEntityClass, entityClass) {
        let name;
        if (entityClass) {
            name = nameOrEntityClass;
        }
        else {
            entityClass = nameOrEntityClass;
        }
        return Config_1.getConnection(name).getRepository(entityClass);
    }
};
Config._instance = undefined;
Config = Config_1 = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], Config);
exports.Config = Config;
var Config_1;
