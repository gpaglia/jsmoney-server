import { IsUUID } from 'class-validator';
import * as uuid from 'uuid';

import { RootDTO } from './root.dto';

import { IDomainObject } from 'jsmoney-server-api';

export abstract class DomainObjectDTO extends RootDTO implements IDomainObject {
  @IsUUID("5")
  readonly id: string;

  constructor();
  constructor(id: string);

  constructor(id?: string) {
    super();
    this.id = id ? id : uuid.v4();
  }
}
