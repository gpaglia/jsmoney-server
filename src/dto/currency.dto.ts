import { IsUppercase, Matches, MinLength, MaxLength, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { RootDTO } from './root.dto';

import { ICurrencyObject } from 'jsmoney-server-api';
import { CurrencyEntity } from '../entities/currency.entity.model';

export class CurrencyDTO extends RootDTO implements ICurrencyObject {
  @IsNotEmpty()
  @IsUppercase()
  @MinLength(3)
  @MaxLength(3)
  readonly code: string;

  @Matches(/[0-9]{3}/)
  @MinLength(3)
  @MaxLength(3)
  readonly iso: string;

  @IsNotEmpty()
  readonly description: string;

  @IsInt()
  @Min(0)
  @Max(5)
  readonly scale: number;

  constructor(entity: CurrencyEntity);
  constructor(code: string, iso: string, description: string, scale: number);

  constructor(codeOrEntity: string|CurrencyEntity, iso?: string, description?: string, scale?: number) {
    super();
    if (arguments.length === 1) {
      let e: CurrencyEntity = codeOrEntity as CurrencyEntity;
      this.code = e.code;
      this.iso = e.iso;
      this.description = e.description;
      this.scale = e.scale;
    } else {
      this.code = codeOrEntity as string;
      this.iso = iso;
      this.description = description;
      this.scale = scale;
    }
  }
};
