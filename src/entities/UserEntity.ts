/**
 * UserEntity class
 */
import {
  Column,
  Table
} from "typeorm";

import { BaseEntity } from ".";

import {
  UserAndPasswordObject
} from "jsmoney-server-api";

@Table()
export class UserEntity extends BaseEntity {
  @Column({ unique: true }) public username: string;
  @Column() public password: string;
  @Column() public firstName: string;
  @Column() public lastName: string;
  @Column() public email: string;
  @Column("int") public role: number;

  constructor();
  constructor(obj: UserAndPasswordObject);

  constructor(obj?: UserAndPasswordObject) {
    if (obj) {
      super(obj.user);
      this.password = obj.password;
      this.username = obj.user.username;
      this.firstName = obj.user.firstName;
      this.lastName = obj.user.lastName;
      this.email = obj.user.email;
      this.role = obj.user.role as number;

    } else {
      super();
    }
  }
}
