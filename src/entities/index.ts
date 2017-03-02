/**
 * Index import file
 */
import { BaseEntity } from "./BaseEntity";
import { CommodityEntity } from "./CommodityEntity";
import { CurrencyEntity } from "./CurrencyEntity";
import { CurrencyRateEntity } from "./CurrencyRateEntity";
import { DatasetEntity } from "./DatasetEntity";
import { SecurityEntity } from "./SecurityEntity";
import { UserEntity } from "./UserEntity";

export {
  BaseEntity,
  CurrencyEntity,
  UserEntity,
  DatasetEntity,
  CurrencyRateEntity,
  SecurityEntity,
  CommodityEntity
};

// tslint:disable-next-line:export-name
export const ENTITIES: Function[] = [
  BaseEntity,
  CurrencyEntity,
  UserEntity,
  DatasetEntity,
  CurrencyRateEntity,
  SecurityEntity,
  CommodityEntity
];
