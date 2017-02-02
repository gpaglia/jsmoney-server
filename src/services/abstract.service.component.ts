import * as logging from 'winston';

import { Service, Container } from 'typedi';
import { Connection, EntityManager } from 'typeorm';
import { Validator } from 'class-validator';
import { getConfigData, getConnection, getEntityManager } from '../_singletons/config';

export interface ObjectLiteral {
    [key: string]: any;
}

@Service()
export abstract class AbstractServiceComponent {
  protected configData: any;
  protected entityManager: EntityManager;
  protected connection: Connection;
  protected validator: Validator;

  constructor() {
    this.configData = getConfigData();
    this.connection = getConnection();
    this.entityManager = this.connection.entityManager;
    this.validator = Container.get<Validator>(Validator);

  }
}
