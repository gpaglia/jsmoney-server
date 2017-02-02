import * as nconf from 'nconf';
import * as logger from 'winston';
import { Container, Service } from 'typedi';
import { ConnectionManager, Connection, Repository, EntityManager } from 'typeorm';

const env: string = process.env.NODE_ENV;
const path: string = __dirname + '/config/_app/';

export type ObjectType<T> = { new (): T }|Function;

@Service()
export class Config {
  private _config: any;
  private static _instance: Config = undefined;

  constructor() {
    logger.debug('[SERVER] Config initializing, path is ' + path);
    if (Config._instance) {
      logger.error('[SERVER] Trying to initialize config multiple times');
      throw('COnfig already initialized');
    }
    // Fixed, non configurable data
    nconf.overrides({

    });

    // Process env and argv
    nconf.env().argv();

    nconf.file('specific', path + env + '.config.json');
    nconf.file('common', path + 'common.config.json');

    nconf.defaults({

    });

    this._config = nconf.get(undefined);

    logger.debug('[SERVER] Config object: ' + JSON.stringify(this._config, null, 4));
  }

  data: any = () => {
    return this._config;
  }

  static data: any = () => {
    if (! Config._instance) {
      // this will load the config data
      Config._instance = new Config();
      Container.set(Config, Config._instance);
    }

    return Config._instance._config;
  }

}

export function loadConfig() {
  Config.data();
}

export function getConfigData(): any {
  let config: Config = Container.get<Config>(Config);
  return config.data();
}

export function getConnectionManager(): ConnectionManager {
  return Container.get<ConnectionManager>(ConnectionManager);
}

export function getConnection(name? : string): Connection {
  if (! name) {
    name = Config.data().database.name;
  }
  return getConnectionManager().get(name);
}

export function getEntityManager(name?: string): EntityManager {
  return getConnection(name).entityManager;
}

export function getRepository<T>(entityClass: ObjectType<T>): Repository<T>;
export function getRepository<T>(name: string, entityClass: ObjectType<T>): Repository<T>;
export function getRepository<T>(nameOrEntityClass: string|ObjectType<T>, entityClass?: ObjectType<T>): Repository<T> {
  let name: string;
  if (entityClass) {
    name = nameOrEntityClass as string;
  } else {
    entityClass = nameOrEntityClass as ObjectType<T>;
  }

  return getConnection(name).getRepository(entityClass);
}
