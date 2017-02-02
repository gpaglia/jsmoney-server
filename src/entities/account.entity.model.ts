import { Table, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity.model';
import { DatasetEntity } from './dataset.entity.model';

import { AccountDTO } from '../dto/account.dto';

@Table()
export class AccountEntity extends BaseEntity {
  @Column() name: string;
  @Column() description: string;
  @Column() currency: string;
  @Column('decimal') balance: string;

  @ManyToOne(type => DatasetEntity)
  dataset: DatasetEntity;

  constructor();
  constructor(name: string, description: string, currency: string, dataset: DatasetEntity);
  constructor(id: string, version: number, name: string, description: string, currency: string, dataset: DatasetEntity);
  constructor(adto: AccountDTO, dataset: DatasetEntity);

  constructor(...args: any[]) {
    if (args.length === 0) {
      super();
    } else if (args.length === 2) {
      let adto: AccountDTO = args[0] as AccountDTO;
      super(adto);
      this.dataset = args[1] as DatasetEntity;
      this.name = adto.name;
      this.description = adto.description;
      this.currency = adto.currency;
    } else if (args.length === 4) {
      super();
      this.name = args[0] as string;
      this.description = args[1] as string;
      this.currency = args[2] as string;
      this.dataset = args[3] as DatasetEntity;
    } else if (args.length === 6) {
      super(args[0] as string, args[1] as number);
      this.name = args[2] as string;
      this.description = args[3] as string;
      this.currency = args[4] as string;
      this.dataset = args[5] as DatasetEntity;
    }
  }
}
