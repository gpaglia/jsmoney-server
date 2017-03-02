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

}
