/**
 * DB Config & Start
 */
import * as logger from "winston";

import {
  ConnectionOptions,
  createConnection
} from "typeorm";

import { Config } from "../_singletons/Config";

import { ENTITIES } from "../entities";

export function dbConfig(): Promise<void> {

  const configData = Config.getConfigData();

  const options: ConnectionOptions = {
    name: configData.database.name,
    driver: configData.database.driver,
    logging: configData.database.logging,
    entities: [...ENTITIES],
    autoSchemaSync: configData.database.autoSchemaSync,
    dropSchemaOnConnection: configData.database.dropSchemaOnConnection
  };

  logger.debug("[SERVER] Creating connection with options " + JSON.stringify(options, null, 4));
  // Create connection
  const promise = createConnection(options)
    .then(
      (connection) => {
        logger.info("[SERVER] DB Connection is " + connection.name);
      },
      (err) => {
        logger.info("[SERVER] Error in db start " + JSON.stringify(err, null, 4));
      });

  logger.debug("[SERVER] Exiting startDb()...");
  return promise;
}
