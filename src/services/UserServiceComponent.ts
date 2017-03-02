/**
 * UserServiceComponent class
 */
import * as logger from "winston";

import {
  Service
} from "typedi";

import {
  AbstractServiceComponent,
  IObjectLiteral,
  ServiceError
} from ".";

import { UserEntity } from "../entities";

import {
  CredentialsObject,
  UserAndPasswordObject,
  UserObject
} from "jsmoney-server-api";

export enum ValidationStatus {
  Validated,
  NoUser,
  WrongPassword,
  InvalidData
}

export class ValidationInfo {
  constructor(public status: ValidationStatus, public user: UserObject) { }
}

// tslint:disable-next-line:max-classes-per-file
@Service()
export class UserServiceComponent extends AbstractServiceComponent {

  constructor() {
    super();
  }

  public validateUserByCredentials(cred: CredentialsObject): Promise<ValidationInfo> {
    return cred.isValid() ? this.getOneUserEntityByConditions({ username: cred.username })
      .then((entity) => {
        if (!entity) {
          return new ValidationInfo(ValidationStatus.NoUser, undefined);
        } else if (cred.password === entity.password) {
          return new ValidationInfo(ValidationStatus.Validated, UserObject.make(entity));
        } else {
          return new ValidationInfo(ValidationStatus.WrongPassword, undefined);
        }
      })
      .catch((error) => {
        throw new ServiceError("Error in validateUserByCredentials", error);
      }) : Promise.resolve(new ValidationInfo(ValidationStatus.InvalidData, undefined));
  }

  public getOneUserEntityByConditions(conditions: IObjectLiteral): Promise<UserEntity> {
    return this.connection
      .getRepository<UserEntity>(UserEntity)
      .findOne(conditions)
      .catch((error) => {
        throw new ServiceError("Error in getOneUserEntityByConditions", error);
      });
  }

  public getOneUserByConditions(conditions: IObjectLiteral): Promise<UserObject> {
    return this.getOneUserEntityByConditions(conditions)
      .then((ue: UserEntity) => {
        return UserObject.make(ue);
      });
  }

  public getOneUserEntityByUsername(uname: string): Promise<UserEntity> {
    return this.getOneUserEntityByConditions({ username: uname });
  }

  public getOneUserByUsername(uname: string): Promise<UserObject> {
    return this.getOneUserByConditions({ username: uname });
  }

  public getOneUserEntityByUsernameAndPassword(uname: string, pwd: string): Promise<UserEntity> {
    return this.getOneUserEntityByConditions({ username: uname, password: pwd });
  }

  public getOneUserByUsernameAndPassword(uname: string, pwd: string): Promise<UserObject> {
    return this.getOneUserByConditions({ username: uname, password: pwd });
  }

  public getOneUserEntityById(uid: string): Promise<UserEntity> {
    return this.getOneUserEntityByConditions({ id: uid });
  }

  public getOneUserById(uid: string): Promise<UserObject> {
    return this.getOneUserByConditions({ id: uid });
  }

  public getAllUserEntities(): Promise<UserEntity[]> {
    return this.connection
      .getRepository<UserEntity>(UserEntity)
      .find()
      .catch((error) => {
        throw new ServiceError("Error in getAllUserEntities", error);
      });
  }

  public getAllUsers(): Promise<UserObject[]> {
    return this.getAllUserEntities().then((uea: UserEntity[]) => {
      return uea.map((ue: UserEntity) => {
        return UserObject.make(ue);
      });
    });
  }

  public getAllUsersCount(): Promise<number> {
    return this.connection
      .getRepository<UserEntity>(UserEntity)
      .findAndCount()
      .catch((error) => {
        throw new ServiceError("Error in getUserCount", error);
      })
      .then((result: [UserEntity[], number]) => {
        logger.debug("[SERVER] User count is " + result[1]);
        return (result[1] as number);
      });
  }

  public createOneUser(obj: UserAndPasswordObject): Promise<UserObject> {
    if (obj.isValid()) {
      const newUser: UserEntity = new UserEntity(obj);
      return this.connection
        .getRepository<UserEntity>(UserEntity)
        .persist(newUser)
        .catch((error) => {
          throw new ServiceError("Error in createUser", error);
        })
        .then((entity) => {
          return UserObject.make(entity);
        });
    } else {
      return Promise.reject(new ServiceError("Error in createUser, invalid user data or null password"));
    }
  }
}