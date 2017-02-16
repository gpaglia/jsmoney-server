import * as logger from 'winston';

import { Service, Container } from 'typedi';
import { Connection, EntityManager } from 'typeorm';

import { AbstractServiceComponent, ObjectLiteral } from './abstract.service.component';
import { ServiceError } from './service.error';

import { UserEntity } from '../entities/user.entity.model';
import { UserDTO, UserAndPasswordDTO } from '../dto/user.dto';

export enum ValidationStatus {
  Validated,
  NoUser,
  WrongPassword
};
export class ValidationInfo {
  constructor(public status: ValidationStatus, public user: UserEntity) {}
};

@Service()
export class UserServiceComponent extends AbstractServiceComponent {

  constructor() {
    super();
  }

  validateUserByCredentials(uname: string, pwd: string): Promise<ValidationInfo> {
    return this.getUserEntityByUsername(uname)
    .then(entity => {
      if (! entity) {
        return new ValidationInfo(ValidationStatus.NoUser, undefined);
      }
      else if (entity.password === pwd) {
        return new ValidationInfo(ValidationStatus.Validated, entity);
      } else {
        return new ValidationInfo(ValidationStatus.WrongPassword, undefined);
      }
    })
    .catch(error => {
      throw new ServiceError('Error in validateUserByCredentials', error);
    })
  }

  private getUserEntityByConditions(conditions: ObjectLiteral): Promise<UserEntity> {
    return this.connection
      .getRepository<UserEntity>(UserEntity)
      .findOne(conditions)
      .catch(error => {
        throw new ServiceError('Error in getUserEntityByConditions', error);
      });
  }

  private getUserDTOByConditions(conditions: ObjectLiteral): Promise<UserDTO> {
    return this.getUserEntityByConditions(conditions)
            .then(entity => {
              return this.userEntityToDTO(entity)
            });
  }

  getUserEntityByUsername(uname: string): Promise<UserEntity> {
    return this.getUserEntityByConditions({'username': uname});
  }

  getUserDTOByUsername(uname: string): Promise<UserDTO> {
    return this.getUserDTOByConditions({'username': uname});
  }

  getUserEntityById(uid: string): Promise<UserEntity> {
    return this.getUserEntityByConditions({'_id': uid});
  }

  getUserDTOById(uid: string): Promise<UserDTO> {
    return this.getUserDTOByConditions({'_id': uid});
  }

  getAllUserEntities(): Promise<UserEntity[]> {
    return this.connection
      .getRepository<UserEntity>(UserEntity)
      .find()
      .catch(error => {
        throw new ServiceError('Error in getAllUserEntities', error);
      });
  }

  getAllUserDTOs(): Promise<UserDTO[]> {
    return this.getAllUserEntities()
      .then(entities => {
        return this.userEntityArrayToDTOArray(entities);
      })
  }

  getUserCount(): Promise<number> {
    return this.connection
      .getRepository<UserEntity>(UserEntity)
      .findAndCount()
      .catch(error => {
        return new ServiceError('Error in getUserCount', error);
      })
      .then((result: [any[], number]) => {
        logger.debug('[SERVER] User count is ' + result[1]);
        return (result[1] as number);
      })
  }

  createUser(udto: UserAndPasswordDTO): Promise<UserDTO> {
    return this.validator
      .validate(udto)
      .then((errors) => {
        if ((errors && errors.length > 0)) {
          throw new ServiceError('Error in createUser, invalid user data or null password');
        } else {
          let newUser: UserEntity = new UserEntity(udto);
          return this.connection
            .getRepository<UserEntity>(UserEntity)
            .persist(newUser)
            .catch(error => {
              throw new ServiceError('Error in createUser', error);
            })
            .then(entity => {
              return this.userEntityToDTO(entity);
            });
        } // else
      });
  }

  userEntityToDTO(ue: UserEntity): Promise<UserDTO> {
    if (ue == null) {
      return undefined;
    }
    let udto: UserDTO = new UserDTO(ue);
    logger.debug('[SERVER] UserDTO is ' + udto.toString());
    return this.validator.validate(udto)
    .then(errors => {
      if (errors.length > 0) {
        logger.error('[SERVER] Got validation errors on UserDTO... ' + JSON.stringify(errors, null, 4));
        throw new ServiceError('Validation of UserDTO failed', errors);
      } else {
        return udto;
      }
    });
  }

  userEntityArrayToDTOArray(uearray: UserEntity[]): Promise<UserDTO[]> {
    let tmp: Promise<UserDTO>[] = [];
    for (let ue of uearray) {
      tmp.push(this.userEntityToDTO(ue));
    }
    return Promise.all(tmp);
  }
}
