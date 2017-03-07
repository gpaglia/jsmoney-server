/**
 * BaseEntity class
 */
import { AbstractTable, PrimaryColumn, VersionColumn } from "typeorm";

import { DomainObject } from "jsmoney-server-api";

@AbstractTable()
export abstract class BaseEntity {
  @PrimaryColumn()
  public id: string;

  @VersionColumn()
  public version: number;

  constructor();
  constructor(obj: DomainObject);

  constructor(obj?: DomainObject) {
    if (obj) {
      this.id = obj.id;
      this.version = obj.version;
    }
  }

  // tslint:disable-next-line:no-any
  public toJSON(): any {
    return this;
  }

}
