import { IsNotEmpty, Matches, MinLength, MaxLength, ArrayNotEmpty, IsUppercase } from 'class-validator';

import { VersionedObjectDTO } from './versioned.object.dto';
import { DatasetEntity } from '../entities/dataset.entity.model';
import { IDatasetObject } from 'jsmoney-server-api';

export class DatasetDTO extends VersionedObjectDTO implements IDatasetObject {
  @IsNotEmpty()
  @Matches(/[A-Za-z][A-Za-z0-9_]+/)
  @MaxLength(32)
  readonly name: string;

  readonly description: string;

  @IsNotEmpty()
  @IsUppercase()
  @MinLength(3)
  @MaxLength(3)
  readonly currency: string;

  @IsNotEmpty({each: true})
  @IsUppercase({each: true})
  @MinLength(3, {each: true})
  @MaxLength(3, {each: true})
  readonly additionalCurrencies: string[];

  constructor(entity: DatasetEntity);
  constructor(idataset: IDatasetObject);

  constructor(obj: DatasetEntity|IDatasetObject){
    if (obj instanceof DatasetEntity) {
      let e = obj as DatasetEntity;
      super(e._id, e._version);
    } else {
      let i = obj as IDatasetObject;
      super(i.id, i.version);
    }

    this.name = obj.name;
    this.description = obj.description;
    this.currency = obj.currency;
    this.additionalCurrencies = obj.additionalCurrencies;
  }

};
