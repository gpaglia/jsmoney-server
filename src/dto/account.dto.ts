import { IsNotEmpty, Matches, MinLength, MaxLength, IsUppercase, ArrayNotEmpty } from 'class-validator';

import * as bigjs from 'big.js';
import BigJS = BigJsLibrary.BigJS;

import { VersionedObjectDTO } from './versioned.object.dto';
import { IAccountObject, AccountType } from 'jsmoney-server-api';
import { AccountEntity } from '../entities/account.entity.model';

export class AccountDTO extends VersionedObjectDTO implements IAccountObject {
  @IsNotEmpty()
  @Matches(/[A-Za-z][A-Za-z0-9_]+/)
  @MaxLength(32)
  readonly name: string;

  readonly description: string;

  @IsNotEmpty()
  readonly accType: AccountType;

  @IsNotEmpty()
  @IsUppercase()
  @MinLength(3)
  @MaxLength(3)
  readonly currency: string;

  @IsNotEmpty()
  readonly balance: BigJS;

  constructor(entity: AccountEntity);
  constructor(iaccount: IAccountObject);

  constructor(obj: AccountEntity|IAccountObject) {
    if (obj instanceof AccountEntity) {
      let e = obj as AccountEntity;
      super(e._id, e._version);
      this.balance = Big(e.balance);

    } else {
      let i = obj as IAccountObject;
      super(i.id, i.version);
      this.balance = i.balance;
    }

    this.name = obj.name;
    this.description = obj.description;
    this.currency = obj.currency;
  }

};
