import { IsInt, Min } from 'class-validator';
import { DomainObjectDTO } from './domain.object.dto';

import { IVersionedObject } from 'jsmoney-server-api';


export abstract class VersionedObjectDTO extends DomainObjectDTO implements IVersionedObject {
  @IsInt()
  @Min(0)
  readonly version: number;

  constructor();
  constructor(id: string);
  constructor(id: string, version: number);

  constructor(id?: string, version?: number) {
    super(id);
    this.version = (id && version) ? version : 0;
  }
}
