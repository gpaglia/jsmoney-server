/**
 * CommodityEntity class
 */

import {
  AbstractTable,
  Column
} from "typeorm";

import {
  BaseEntity
} from ".";

import {
  CommodityObject
} from "jsmoney-server-api";

@AbstractTable()
export abstract class CommodityEntity extends BaseEntity {
  @Column({ unique: true }) public code: string; // the internatially recognized symbol
  @Column("int") public comType: number;
  @Column() public description: string;
  @Column() public currencyCode: string;
  @Column() public unit: string;
  @Column("int") public scale: number;
  @Column("simple_array") public quoteDrivers: string[];
  @Column("decimal") public lastPrice: string;
  @Column("date") public lastPriceDate: Date;
  @Column() public lastPriceInfo: string;

  constructor();
  constructor(obj: CommodityObject);

  constructor(obj?: CommodityObject) {
    super(obj);
    if (obj) {
      this.code = obj.code;
      this.comType = obj.comType as number;
      this.description = obj.description;
      this.currencyCode = obj.currencyCode;
      this.unit = obj.unit;
      this.scale = obj.scale;
      this.quoteDrivers = obj.quoteDrivers;
      this.lastPrice = obj.lastPrice.toString();
      this.lastPriceDate = obj.lastPriceDate;
      this.lastPriceInfo = obj.lastPriceInfo;
    }
  }
}
