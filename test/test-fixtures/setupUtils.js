/**
 * DB Setup class for texsting purposes
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// stub node process.env
const logger = require("winston");
require("reflect-metadata");
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const Config_1 = require("../_singletons/Config");
const dbConfig_1 = require("../startup/dbConfig");
setLogLevel("info");
class Helper {
    constructor() {
        this.counter = 0;
        this.counter = 0;
    }
    increment() {
        this.counter = this.counter + 1;
    }
    getCounter() {
        return this.counter;
    }
}
function startup(done) {
    init().then(() => { done(); });
}
exports.startup = startup;
function teardown(done) {
    closeTestDb().then(() => { done(); });
}
exports.teardown = teardown;
// tslint:disable-next-line:export-name
function init() {
    const h = typedi_1.Container.get(Helper);
    if (h.getCounter() === 0) {
        console.log("***** Initializing ", logger.level);
        h.increment();
        typeorm_1.useContainer(typedi_1.Container);
        typedi_1.Container.provide([{
                name: "ROOT_DIR",
                type: String,
                value: __dirname + "/.."
            }]);
        return dbConfig_1.dbConfig();
    }
    else {
        console.log("***** Skipping Initialization ");
        const connection = Config_1.Config.getConnection();
        if (!connection.isConnected) {
            return connection.connect()
                .then((_cn) => {
                console.log("***** Connection being reconnected");
                return Promise.resolve();
            })
                .catch((error) => {
                console.log("Error in connection.connect()", error);
                throw (error);
            });
        }
        else {
            return Promise.resolve();
        }
    }
}
exports.init = init;
function clearTestDb() {
    const connection = Config_1.Config.getConnection();
    console.log("In clearTestDb()");
    return connection
        .syncSchema(true)
        .then(() => {
        console.log("DB Synced");
        return;
    })
        .catch((error) => {
        console.log("Error in clearTestDb() ", error);
        throw (error);
    });
}
exports.clearTestDb = clearTestDb;
function closeTestDb() {
    const connection = Config_1.Config.getConnection();
    if (connection.isConnected) {
        return connection.close()
            .then(() => {
            console.log("DB Closed");
            return;
        })
            .catch((error) => {
            console.log("Error in closeTestDb() ", error);
            throw (error);
        });
    }
    else {
        console.log("DB already closed");
        return Promise.resolve();
    }
}
exports.closeTestDb = closeTestDb;
function setLogLevel(lvl) {
    let x = logger;
    x.level = lvl;
    /*
    logger.configure({
        level: lvl,
        transports: [
            new logger.transports.Console()
        ]
    });
    */
}
