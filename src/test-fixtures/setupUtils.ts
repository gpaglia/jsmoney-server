/**
 * DB Setup class for texsting purposes
 */

// stub node process.env

import * as logger from "winston";

import "reflect-metadata";

import { Container } from "typedi";

import { useContainer as typeOrmUseContainer } from "typeorm";

import { Config } from "../_singletons/Config";

import { Connection } from "typeorm";

import { dbConfig } from "../startup/dbConfig";

setLogLevel("info");

class Helper {
    private counter: number = 0;
    constructor() {
        this.counter = 0;
    }

    public increment() {
        this.counter = this.counter + 1;
    }

    public getCounter(): number {
        return this.counter;
    }
}

export function startup(done: () => void): void {
    init().then(() => { done(); });
}

export function teardown(done: () => void): void {
    closeTestDb().then(() => { done(); });
}

// tslint:disable-next-line:export-name
export function init(): Promise<void> {
    const h = Container.get<Helper>(Helper);
    if (h.getCounter() === 0) {     // first time
        console.log("***** Initializing ", logger.level);
        h.increment();
        typeOrmUseContainer(Container);
        Container.provide([{
            name: "ROOT_DIR",
            type: String,
            value: __dirname + "/.."
        }]);
        return dbConfig();
    } else {
        console.log("***** Skipping Initialization ");
        const connection: Connection = Config.getConnection();
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
        } else {
            return Promise.resolve();
        }
    }

}

export function clearTestDb(): Promise<void> {
    const connection: Connection = Config.getConnection();
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

export function closeTestDb(): Promise<void> {
    const connection: Connection = Config.getConnection();
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
    } else {
        console.log("DB already closed");
        return Promise.resolve();
    }
}

interface ILogger {
    level: string;
}

function setLogLevel(lvl: string): void {
    let x: ILogger = logger as ILogger;
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
