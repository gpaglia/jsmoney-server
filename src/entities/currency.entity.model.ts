import { Table, PrimaryColumn, Column } from 'typeorm';

@Table()
export class CurrencyEntity {
  constructor(code: string, iso: string, description: string, scale: number) {
    this.code = code;
    this.iso = iso;
    this.description = description;
    this.scale = scale;
  }
  @PrimaryColumn() code: string;
  @Column() iso: string;
  @Column() description: string;
  @Column() scale: number;
}
