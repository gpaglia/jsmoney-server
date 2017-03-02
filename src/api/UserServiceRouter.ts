/**
 * UserServiceRouter class
 */
import * as logger from "winston";

import {
  NextFunction,
  Request,
  Response
} from "express";

import * as passport from "passport";

import {
  Container,
  Service
} from "typedi";

import { AbstractServiceRouter } from ".";

import {
  ServiceError,
  UserServiceComponent
} from "../services";

import {
  AuthenticateDataObject,
  Body,
  makeBody,
  UserAndPasswordObject,
  UserObject
} from "jsmoney-server-api";

import {
  ApiError,
  INTERNAL_ERROR,
  NO_USERS_FOUND,
  NOT_YET_IMPLEMENTED
} from "./ApiError";

@Service()
export class UserServiceRouter extends AbstractServiceRouter {
  constructor() {
    super();
  }

  protected doConfig(): void {

    // save variables in closure
    // let userRepo: Repository<UserEntity> = this.connection.getRepository(UserEntity);
    const userServiceComponent: UserServiceComponent = Container.get<UserServiceComponent>(UserServiceComponent);

    this.router.post(
      this.apiPath("/authenticate"),
      passport.authenticate("local", { session: false }),
      serialize,
      // me.generateToken,
      (req: Request, res: Response) => {
        const ret: Body<AuthenticateDataObject> = makeBody(
          AuthenticateDataObject.make(
          {
            user: req.user.user as UserObject,           // this is a user object
            token: req.user.token as string              // token
          })
        );
        res.status(200).json(ret);
        return;
      }
    );

    this.router.get(
      this.apiPath("/usersNoAuthcount"),
      (req: Request, res: Response) => {
        logger.debug("[SERVER] got GET /usersNoAuthCount, body: " + JSON.stringify(req.body, null, 4));
        userServiceComponent.getAllUsersCount()
          .catch((error: ServiceError) => {
            throw new ApiError(500, error);
          })
          .then((count) => {
            res.json(makeBody(count));
          })
          .catch((error: ApiError) => {
            res.status(error.status).json(error);
          });
      }
    );

    this.router.get(
      this.apiPath("/usersNoAuth"),
      (req: Request, res: Response) => {
        logger.debug("[SERVER] got GET /users, body: " + JSON.stringify(req.body, null, 4));
        userServiceComponent.getAllUsers()
          .catch((error: ServiceError) => {
            throw new ApiError(500, error);
          })
          .then((objarray: UserObject[]) => {
            if (objarray && objarray.length > 0) {
              const ret: Body<UserObject[]> = makeBody(objarray);
              res.json(ret);
            } else {
              throw NO_USERS_FOUND;
            }
          })
          .catch((error: ApiError) => {
            res.status(error.status).json(error);
          });
      }
    );

    this.router.get(
      this.apiPath("/users"),
      passport.authenticate("token", { session: false }),
      this.requireAdministrator(),
      (req: Request, res: Response) => {
        logger.debug("[SERVER] got GET /users, body: " + JSON.stringify(req.body, null, 4));
        userServiceComponent.getAllUsers()
          .catch((error: ServiceError) => {
            throw new ApiError(500, error);
          })
          .then((objarray: UserObject[]) => {
            if (objarray && objarray.length > 0) {
              const ret: Body<UserObject[]> = makeBody(objarray);
              res.json(ret);
            } else {
              throw NO_USERS_FOUND;
            }
          })
          .catch((error: ApiError) => {
            res.status(error.status).json(error);
          });
      }
    );

    this.router.get(
      this.apiPath("/users/:id"),
      passport.authenticate("token", { session: false }),
      this.requireAdministrator(),
      (req: Request, res: Response) => {
        const id = req.params.id;
        logger.debug("[SERVER] got GET /users/:id, id: " + id + " body: " + JSON.stringify(req.body, null, 4));
        if (id) {
          userServiceComponent.getOneUserByUsername(id)
            .catch((error: ServiceError) => {
              throw new ApiError(500, error);
            })
            .then((obj: UserObject) => {
              if (obj) {
                const ret: Body<UserObject> = makeBody(obj);
                res.json(ret);
              } else {
                throw new ApiError(404, NO_USERS_FOUND.message, "Unknown user " + JSON.stringify(id, null, 4));
              }
            })
            .catch((error: ApiError) => {
              res.status(error.status).json(error);
            });
        } else {
          res.status(INTERNAL_ERROR.status).json(INTERNAL_ERROR);
        }
      }
    );

    this.router.post(
      this.apiPath("/users"),
      passport.authenticate("token", { session: false }),
      this.requireAdministrator(),
      (req: Request, res: Response) => {
        logger.debug("[SERVER] got POST /users, body: " + JSON.stringify(req.body, null, 4));
        userServiceComponent.createOneUser(UserAndPasswordObject.make(req.body))
          .catch((error: ServiceError) => {
            throw new ApiError(500, error);
          })
          .then((obj: UserObject) => {
            const ret: Body<UserObject> = makeBody(obj);
            res.status(201).json(ret);
          });
      }
    );

    this.router.delete(
      this.apiPath("/users/:id"),
      passport.authenticate("token", { session: false }),
      this.requireAdministrator(),
      (/* req: Request, */ res: Response) => {
        // const id = req.params.id;
        res.status(NOT_YET_IMPLEMENTED.status).json(NOT_YET_IMPLEMENTED);
      }
    );
  }
}

function serialize(_req: Request, _res: Response, next: NextFunction): void {
  next();
}
