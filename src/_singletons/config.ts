/**
 * Config sigleton
 */

import * as nconf from "nconf";
import * as logger from "winston";

import { Container, Service } from "typedi";

import {
  Connection,
  ConnectionManager,
  EntityManager,
  Repository
} from "typeorm";

export type ObjectType<T> = { new (): T } | Function;

@Service()
export class Config {
  private static _instance: Config = undefined;
  // tslint:disable-next-line:no-any
  private _config: any;

  constructor() {
    // tslint:disable:no-any
    const rootDir = Container.get<String>("ROOT_DIR");
    const env: string = process.env.NODE_ENV;
    const path: string = rootDir + "/config/_app/";

    logger.debug("[SERVER] Config initializing, path is " + path);
    if (Config._instance) {
      logger.error("[SERVER] Trying to initialize config multiple times");
      throw ("Config already initialized");
    }
    // Fixed, non configurable data
    nconf.overrides({

    });

    // Process env and argv
    nconf.env().argv();

    logger.debug("[SERVER] Config initializing, env is " + env);

    nconf.file("specific", path + env + ".config.json");
    nconf.file("common", path + "common.config.json");

    nconf.defaults({

    });

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
  public static getConfigData(): any {
    const config: Config = Container.get<Config>(Config);
    return config.data();
  }

  public static getConnectionManager(): ConnectionManager {
    return Container.get<ConnectionManager>(ConnectionManager);
  }

  public static getConnection(name?: string): Connection {
    if (!name) {
      name = Config.getConfigData().database.name;
    }
    return Config.getConnectionManager().get(name);
  }

  public static getEntityManager(name?: string): EntityManager {
    return Config.getConnection(name).entityManager;
  }

  public static getRepository<T>(entityClass: ObjectType<T>): Repository<T>;
  public static getRepository<T>(name: string, entityClass: ObjectType<T>): Repository<T>;
  public static getRepository<T>(nameOrEntityClass: string | ObjectType<T>, entityClass?: ObjectType<T>): Repository<T> {
    let name: string;
    if (entityClass) {
      name = nameOrEntityClass as string;
    } else {
      entityClass = nameOrEntityClass as ObjectType<T>;
    }

    return Config.getConnection(name).getRepository(entityClass);
  }

  // Instance method
  public data: any = () => {
    // console.log("Config data is ", this._config);
    return this._config;
  }
}
