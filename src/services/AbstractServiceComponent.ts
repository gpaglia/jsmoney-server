/**
 * AbstractServiceComponent
 */
// import * as logging from "winston";

import {
  Service
} from "typedi";

import {
  Connection,
  EntityManager
} from "typeorm";

import {
  Config
} from "../_singletons/Config";

export interface IObjectLiteral {
    // tslint:disable-next-line:no-any
    [key: string]: any;
}

@Service()
export abstract class AbstractServiceComponent {
  // tslint:disable-next-line:no-any
  protected configData: any;
  protected entityManager: EntityManager;
  protected connection: Connection;

  constructor() {
    this.configData = Config.getConfigData();
    this.connection = Config.getConnection();
    this.entityManager = this.connection.entityManager;
  }

  protected createSelectionParam(alias: string, conditions: IObjectLiteral): string {
    let result: string = "";
    let first: boolean = true;
    Object.keys(conditions).forEach((key: string) => {
      let value: string;
      if (typeof conditions[key] === "string") {
        value = conditions[key] as string;
      } else if (typeof conditions[key] === "number") {
        value = (conditions[key] as number).toString();
      } else if (typeof conditions[key] === "boolean") {
        value = (conditions[key] as boolean).toString();
      } else {
        value = JSON.stringify(conditions[key]);
      }
      result = result + (first ? "" : " and ") + alias + "." + key + "='" + value + "'";
      first = false;
    });
    return result;
  }
}
