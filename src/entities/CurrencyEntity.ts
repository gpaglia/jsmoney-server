/**
 * CurrencyEntity class
 */
import {
  Column,
  PrimaryColumn,
  Table
} from "typeorm";

import {
  CurrencyObject
} from "jsmoney-server-api";

@Table()
export class CurrencyEntity {
  @PrimaryColumn() public readonly code: string; // the internatially recognized symbol
  @Column({ unique: true }) public readonly iso: string;
  @Column() public description: string;
  @Column("int") public readonly scale: number;

  constructor();
  constructor(code: string, iso: string, description: string, scale: number);
  constructor(obj: CurrencyObject);

  constructor(codeOrObj?: string | CurrencyObject, iso?: string, description?: string, scale?: number) {
   if (arguments.length === 1) {
      this.code = (codeOrObj as CurrencyObject).code;
      this.iso = (codeOrObj as CurrencyObject).iso;
      this.description = (codeOrObj as CurrencyObject).description;
      this.scale = (codeOrObj as CurrencyObject).scale;
    } else if (arguments.length === 4) {
      this.code = codeOrObj as string;
      this.iso = iso;
      this.description = description;
      this.scale = scale;
    }
  }
}
