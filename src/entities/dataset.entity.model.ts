import { Table, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity.model';
import { UserEntity } from './user.entity.model';

import { DatasetDTO } from '../dto/dataset.dto';

@Table()
export class DatasetEntity extends BaseEntity {
  @Column() name: string;
  @Column() description: string;
  @Column() currency: string;
  @Column("simple_array") additionalCurrencies: string[];
  @ManyToOne(type => UserEntity)
  user: UserEntity;

  constructor();
  constructor(name: string, description: string, currency: string, additionalCurrencies: string[], user: UserEntity);
  constructor(id: string, version: number, name: string, description: string, currency: string, additionalCurrencies: string[], user: UserEntity);
  constructor(ddto: DatasetDTO, user: UserEntity);

  constructor(...args: any[]) {
    if (args.length === 0) {
      super();
    } else if (args.length === 2) {
      let ddto: DatasetDTO = args[0] as DatasetDTO;
      super(ddto);
      this.user = args[1] as UserEntity;
      this.name = ddto.name;
      this.description = ddto.description;
      this.currency = ddto.currency;
      this.additionalCurrencies = ddto.additionalCurrencies;
    } else if (args.length === 5) {
      super();
      this.name = args[0] as string;
      this.description = args[1] as string;
      this.currency = args[2] as string;
      this.additionalCurrencies = args[3] as string[];
      this.user = args[4] as UserEntity;
    } else if (args.length === 7) {
      super(args[0] as string, args[1] as number);
      this.name = args[2] as string;
      this.description = args[3] as string;
      this.currency = args[4] as string;
      this.additionalCurrencies = args[5] as string[];
      this.user = args[6] as UserEntity;
    }
  }
}
