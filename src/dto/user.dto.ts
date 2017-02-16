import { IsNotEmpty, Matches, MaxLength, IsEmail, ValidateNested } from 'class-validator';

import { VersionedObjectDTO } from './versioned.object.dto';

import { IUserObject, IUserAndPasswordObject, Role } from 'jsmoney-server-api';

import { UserEntity } from '../entities/user.entity.model';

export class UserDTO extends VersionedObjectDTO implements IUserObject {
  @IsNotEmpty()
  @Matches(/[a-zA-Z][a-zA-Z0-9_]+/)
  @MaxLength(32)
  readonly username: string;

  firstName: string;
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  readonly role: Role

  constructor(entity: UserEntity);
  constructor(iuser: IUserObject);

  constructor(obj: UserEntity|IUserObject) {
    if (obj instanceof UserEntity) {
      let e: UserEntity = obj as UserEntity;
      super(e._id, e._version);
      this.role = e.role;
    } else {
      let i: IUserObject = obj as IUserObject;
      super(i.id, i.version);
      this.role = i.role;
    }

    this.username = obj.username;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.email = obj.email;
  }

}
export class UserAndPasswordDTO implements IUserAndPasswordObject {
  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  @ValidateNested()
  user: UserDTO;

  constructor(entity: UserEntity);
  constructor(iuser: IUserAndPasswordObject);

  constructor(obj: UserEntity|IUserAndPasswordObject) {
    if (typeof obj === 'UserEntity') {
      let e: UserEntity = obj as UserEntity;
      this.user = new UserDTO(e);
      this.password = e.password;
    } else {
      let i: IUserAndPasswordObject = obj as IUserAndPasswordObject;
      this.user = new UserDTO(i.user);
      this.password = i.password;
    }
  }
}
