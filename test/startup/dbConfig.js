"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * DB Config & Start
 */
const logger = require("winston");
const typeorm_1 = require("typeorm");
const Config_1 = require("../_singletons/Config");
const entities_1 = require("../entities");
function dbConfig() {
    const configData = Config_1.Config.getConfigData();
    const options = {
        name: configData.database.name,
        driver: configData.database.driver,
        logging: configData.database.logging,
        entities: [...entities_1.ENTITIES],
        autoSchemaSync: configData.database.autoSchemaSync,
        dropSchemaOnConnection: configData.database.dropSchemaOnConnection
    };
    logger.debug("[SERVER] Creating connection with options " + JSON.stringify(options, null, 4));
    // Create connection
    const promise = typeorm_1.createConnection(options)
        .then((connection) => {
        logger.info("[SERVER] DB Connection is " + connection.name);
    }, (err) => {
        logger.info("[SERVER] Error in db start " + JSON.stringify(err, null, 4));
    });
    logger.debug("[SERVER] Exiting startDb()...");
    return promise;
}
exports.dbConfig = dbConfig;
