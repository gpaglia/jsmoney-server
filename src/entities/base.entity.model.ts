import { AbstractTable, PrimaryColumn, VersionColumn } from 'typeorm';
import { VersionedObjectDTO } from '../dto/versioned.object.dto';
import * as uuid from 'uuid';

@AbstractTable()
export abstract class BaseEntity {
  @PrimaryColumn()
  _id: string;

  @VersionColumn()
  _version: number;

  constructor();
  constructor(id: string);
  constructor(id: string, version: number);
  constructor(dto: VersionedObjectDTO);

  constructor(idOrDto?: string|VersionedObjectDTO, version?: number) {
    if (version) {
      this._id = idOrDto as string;
      this._version = version;
    } else if (idOrDto && typeof idOrDto === 'string') {
      this._id = idOrDto as string;
      this._version = 0;
    } else if (idOrDto) {
      let dto = idOrDto as VersionedObjectDTO;
      this._id = dto.id;
      this._version = dto.version
    }
    if (!this._id) {
      this._id = uuid.v4();
    }
    if (!version) {
      this._version = 0;
    }
  }

}
