/**
 * Default user data loader
 */
import * as logger from "winston";

import * as uuid from "uuid";

import { UserServiceComponent } from "../services";

import { Container } from "typedi";

import {
  Role,
  UserAndPasswordObject,
  UserObject
} from "jsmoney-server-api";

// tslint:disable-next-line:no-any
const defaultUsers: any[] = [
  {
    user: {
      id: uuid.v4(),
      version: 0,
      username: "admin",
      firstName: "...",
      lastName: "...",
      email: "admin@domain.com",
      role: Role.administrator
    },
    password: "Password"
  },
  {
    user: {
      id: uuid.v4(),
      version: 0,
      username: "user",
      firstName: "...",
      lastName: "...",
      email: "user@domain.com",
      role: Role.user
    },
    password: "Password"
  }
];

export function loadUserData(): Promise<UserObject[]> {
  const userServiceComponent: UserServiceComponent = Container.get<UserServiceComponent>(UserServiceComponent);

  return userServiceComponent
    .getAllUsersCount()
    .catch((error) => {
      logger.error("[SERVER] Error in user initialization loading " + JSON.stringify(error, null, 4));
    })
    .then((count) => {
      if (count === 0) {
        // tslint:disable-next-line:prefer-array-literal
        const parray: Array<Promise<UserObject>> = [];
        for (const iuser of defaultUsers) {
          const udto = UserAndPasswordObject.make(iuser);
          if (udto.isValid()) {
            parray.push(userServiceComponent.createOneUser(udto));
          } else {
            logger.error("[SERVER] Loading users, user skipped (" + JSON.stringify(udto) + ")");
          }
        }
        logger.info("[SERVER] Loading users (" + parray.length + ")");
        return Promise.all(parray);
      } else {
        logger.info("[SERVER] Users already in db, not loaded");
        return Promise.resolve([] as UserObject[]);
      }
    });
}
