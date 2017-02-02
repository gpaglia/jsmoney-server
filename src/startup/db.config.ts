import * as logger from 'winston';

import { Container, Inject, Service } from 'typedi';
import { createConnection, ConnectionOptions, Connection, EntityManager } from 'typeorm';

import { getConfigData } from '../_singletons/config';

import { ENTITIES } from '../entities';

export function startDb(): Promise<void> {

  let configData = getConfigData();

  let options: ConnectionOptions = {
    name: configData.database.name,
    driver: configData.database.driver,
    entities: [...ENTITIES],
    autoSchemaSync: configData.database.autoSchemaSync,
    dropSchemaOnConnection: configData.database.dropSchemaOnConnection
  };

  logger.debug('[SERVER] Creating connection with options ' + JSON.stringify(options, null, 4));
  // Create connection
  let promise = createConnection(options)
  .then(connection => {
    logger.info('[SERVER] DB Connection is ' + connection.name);
  }, err => {
    logger.info('[SERVER] Error in db start ' + JSON.stringify(err, null, 4));
  });

  logger.debug('[SERVER] Exiting startDb()...');
  return promise;
}
