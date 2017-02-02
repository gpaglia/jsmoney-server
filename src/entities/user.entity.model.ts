import { Table, Column } from 'typeorm';

import { BaseEntity } from './base.entity.model';
import { UserDTO, UserAndPasswordDTO } from '../dto/user.dto';

@Table()
export class UserEntity extends BaseEntity {
  @Column ({ unique: true }) username: string;
  @Column() password: string;
  @Column() firstName: string;
  @Column() lastName: string;
  @Column() email: string;
  @Column("int") role: number;

  constructor();
  constructor(username: string, password: string, firstName: string, lastName: string, email: string, role: number);
  constructor(id: string, version: number, username: string, password: string, firstName: string, lastName: string, email: string, role: number);
  constructor(dto: UserDTO, password: string);
  constructor(dtop: UserAndPasswordDTO);

  constructor(...args: any[]) {
    console.log('>>>>> UserEntity constructor ' + JSON.stringify(args, null, 4));
    if (args.length === 0) {
      super();
    } else if (args.length === 1 || args.length === 2) {
      let dto: UserDTO;
      let password: string;
      if (args.length === 1) {
        dto = (args[0] as UserAndPasswordDTO).user;
        password = (args[0] as UserAndPasswordDTO).password;
      } else {
        dto = args[0] as UserDTO;
        password = args[1] as string;
      }
      super(dto);
      this.username = dto.username;
      this.firstName = dto.firstName;
      this.lastName = dto.lastName;
      this.email = dto.email;
      this.role = dto.role;
      this.password = password;
    } else if (args.length === 6) {
      super();
      this.username = args[0] as string;
      this.password = args[1] as string;
      this.firstName = args[2] as string;
      this.lastName = args[3] as string;
      this.email = args[4] as string;
      this.role = args[5] as number;
    } else if (args.length === 8) {
      super(args[0] as string, args[1] as number);
      this.username = args[2] as string;
      this.password = args[3] as string;
      this.firstName = args[4] as string;
      this.lastName = args[5] as string;
      this.email = args[6] as string;
      this.role = args[7] as number;
    } else {
      throw new Error('Invalid number or arguments for UserEntity constructor');
    }
  }

}
