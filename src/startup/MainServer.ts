/**
 * Main config file for server
 */
// This is a global singleton
import "reflect-metadata";

import * as logger from "winston";

import { Container, Service } from "typedi";

import { Config } from "../_singletons/Config";
import { appDataConfig } from "./appDataConfig";

import { expressConfig } from "./expressConfig";

import { dbConfig } from "./dbConfig";

@Service()
export class MainServer {

  // tslint:disable-next-line:no-any
  private configData: any = Config.getConfigData();

  public run(): void {

    logger.info("[SERVER] Starting server initialization, log level: " + logger.level);

    const dbName = this.configData.database.name;
    logger.info("[SERVER] Test database:name = " + dbName);

    const c2: Config = Container.get<Config>(Config);
    logger.info("[SERVER] Test2 database:name = " + c2.data().database.name);

    // Initialize Modules
    Promise.resolve()
    .then(() => {
      return dbConfig();
     })
    .then(() => {
      return appDataConfig();
    })
    .then(() => {
      return expressConfig();
     })
    .catch((err) => {
      logger.error("[SERVER] initialization failed... ", err);
    });
  }
}
