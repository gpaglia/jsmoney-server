/**
 * SecurityEntity class
 */
import {
  Column,
  Table
} from "typeorm";

import {
  CommodityEntity
} from ".";

import {
  SecurityObject
} from "jsmoney-server-api";

@Table()
export class SecurityEntity extends CommodityEntity {
  @Column("int") public secType: number;
  @Column() public altSymbol: string;

  constructor();
  constructor(obj: SecurityObject);

  constructor(obj?: SecurityObject) {
    super(obj);
    if (obj) {
      this.secType = obj.secType;
      this.altSymbol = obj.altSymbol;
    }
  }
}