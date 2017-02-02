// This is a global singleton
import 'reflect-metadata';

import * as logger from 'winston';

import { Container, Inject, Service } from 'typedi';
import { useContainer } from 'typeorm';

import { getConfigData, Config } from '../_singletons/config';
import { initialize as appDataInit } from './app.data.config';

import { startExpress } from './express.config';
import { startDb } from './db.config';

@Service()
export class MainServer {

  private configData = getConfigData();

  constructor() {

  }

  public run(): any {
    let err: any = null;

    logger.info('[SERVER] Starting server initialization, log level: ' + logger.level);

    let dbName = this.configData.database.name;
    logger.info('[SERVER] Test database:name = ' + dbName);

    let c2: Config = Container.get<Config>(Config);
    logger.info('[SERVER] Test2 database:name = ' + c2.data().database.name);

    // Initialize Modules
    Promise.resolve()
    .then(() => {
      return startDb();
     })
    .then(() => {
      return appDataInit();
    })
    .then(() => {
      return startExpress();
     })
    .catch((err) => {
      logger.error('[SERVER] initialization failed... ', err);
    });
  }
}
