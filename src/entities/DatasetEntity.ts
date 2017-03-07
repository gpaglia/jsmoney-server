/**
 * DatasetEntity class
 */
import {
  Column,
  ManyToOne,
  Table
} from "typeorm";

import {
  BaseEntity,
  UserEntity
} from ".";

import {
  DatasetObject,
  IDatasetObject,
  isDatasetObject
} from "jsmoney-server-api";

@Table()
export class DatasetEntity extends BaseEntity implements IDatasetObject {
  @Column() public name: string;
  @Column() public description: string;
  @Column() public currencyCode: string;
  @Column("simple_array") public additionalCurrencyCodes: string[];
  @ManyToOne(() => UserEntity)
  public user: UserEntity;

  public get userId(): string {
    return this.user != null ? this.user.id : undefined;
  }

  constructor();
  constructor(obj: DatasetObject, user: UserEntity);

  constructor(obj?: DatasetObject, user?: UserEntity) {
    super(obj);
    if (obj && user) {
      this.user = user;
      this.name = obj.name;
      this.description = obj.description;
      this.currencyCode = obj.currencyCode;
      this.additionalCurrencyCodes = obj.additionalCurrencyCodes;
    }
  }

  public isValid(): boolean {
    return isDatasetObject(this);
  }
}
