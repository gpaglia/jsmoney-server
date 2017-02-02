import * as logger from 'winston';

import { UserServiceComponent } from '../services/user.service.component';

import { Container } from 'typedi';
import { UserDTO, UserAndPasswordDTO } from '../dto/user.dto';
import { IUserObject, IUserAndPasswordObject, Role } from 'jsmoney-server-api';
import { UserEntity } from '../entities/user.entity.model';
import * as uuid from 'uuid';
let u: IUserObject = {id: '', version: 0, username: 'admin', email: 'ss', role: 0};

let defaultUsers: IUserAndPasswordObject[] = [
  {
    user: {
      id: uuid.v4(),
      version: 0,
      username: 'admin',
      firstName: '...',
      lastName: '...',
      email: 'admin@domain.com',
      role: Role.administrator
    },
    password: 'Password'
  },
  {
    user: {
      id: uuid.v4(),
      version: 0,
      username: 'user',
      firstName: '...',
      lastName: '...',
      email: 'user@domain.com',
      role: Role.user
    },
    password: 'Password'
  }
];


export function loadUserData(): Promise<UserDTO[]> {
  let userServiceComponent: UserServiceComponent = Container.get<UserServiceComponent>(UserServiceComponent);

  return userServiceComponent
    .getUserCount()
    .catch(error => {
      logger.error('[SERVER] Error in user initialization loading ' + JSON.stringify(error, null, 4));
    })
    .then(count => {
      if (count === 0) {
        let parray: Promise<UserDTO>[] = [];
        for (const iuser of defaultUsers) {
          let udto = new UserAndPasswordDTO(iuser);
          parray.push(userServiceComponent.createUser(udto));
        }
        logger.info('[SERVER] Loading users (' + parray.length + ')');
        return Promise.all(parray);
      } else {
        logger.info('[SERVER] Users already in db, not loaded');
        return Promise.resolve([] as UserDTO[]);
      }
    });
}
