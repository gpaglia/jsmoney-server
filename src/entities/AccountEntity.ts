/**
 * AccountEntity class
 */
import {
  Column,
  ManyToOne,
  Table
} from "typeorm";

import {
  BaseEntity,
  DatasetEntity
} from ".";

import { AccountObject } from "jsmoney-server-api";

@Table()
export class AccountEntity extends BaseEntity {
  @Column() public name: string;
  @Column() public description: string;
  @Column() public currencyCode: string;
  @Column("decimal") public qty: string;

  @ManyToOne(() => DatasetEntity)
  public dataset: DatasetEntity;

  constructor();
  constructor(obj: AccountObject);

  constructor(obj?: AccountObject) {
    super(obj);
    if (obj) {
      this.name = obj.name;
      this.description = obj.description;
      this.currencyCode = obj.currencyCode;
      this.qty = obj.qty.toString();
    }
  }
}
