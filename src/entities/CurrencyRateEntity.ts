/**
 * CurrencyRateEntity class
 */
import {
  Table
} from "typeorm";

import {
  CommodityEntity
} from ".";

import {
  CurrencyRateObject
} from "jsmoney-server-api";

@Table()
export class CurrencyRateEntity extends CommodityEntity {

  constructor();
  constructor(obj: CurrencyRateObject);

  constructor(obj?: CurrencyRateObject) {
    super(obj);
  }
}