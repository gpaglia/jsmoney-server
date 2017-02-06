import * as logger from 'winston';

import { Router, Request, Response, NextFunction } from 'express';
import * as passport from 'passport';

import { Container } from 'typedi';
import { Service } from 'typedi';

import { UserEntity } from '../entities/user.entity.model';
import { AbstractServiceRouter } from './abstract.service.router';

import { UserServiceComponent } from '../services/user.service.component';
import { ServiceError } from '../services/service.error';
import { UserDTO, UserAndPasswordDTO } from '../dto/user.dto';
import { CredentialsDTO  } from '../dto/credentials.dto';
import { 
  IUserAndPasswordObject,
  IUserObject,  
  IAuthenticateData,
  IBody,
  makeBody
} from 'jsmoney-server-api';

import { 
  ApiError,
  NO_AUTH_ERROR,
  NO_USER_ERROR,
  NO_USERS_FOUND,
  NOT_YET_IMPLEMENTED,
  INTERNAL_ERROR
} from './api.error';

@Service()
export class UserServiceRouter  extends AbstractServiceRouter {
  constructor() {
    super();
  }

  protected doConfig(): void {

    // save variables in closure
    // let userRepo: Repository<UserEntity> = this.connection.getRepository(UserEntity);
    let me: UserServiceRouter = this;
    let userServiceComponent: UserServiceComponent = Container.get<UserServiceComponent>(UserServiceComponent);

    me.router.post(
      this.apiPath('/authenticate'),
      passport.authenticate('local', { session: false }),
      serialize,
      // me.generateToken,
      function (req: Request, res: Response, next: NextFunction) {
        userServiceComponent.userEntityToDTO(req.user.user)
        .catch((error: ServiceError) => {
          throw new ApiError(500, error);
        })
        .then(udto => {
          let ret: IBody<IAuthenticateData> = makeBody(
            {
              user: udto as IUserObject,           // this is a user dto
              token: req.user.token               // token
            } );
          res.status(200).json(ret);
        })
        .catch((error: ApiError) => {
          res.status(error.status).json(error);
        });
      }
    );

    me.router.get(
      this.apiPath('/usersNoAuthcount'),
      function(req: Request, res: Response, next: NextFunction) {
        logger.debug('[SERVER] got GET /usersNoAuthCount, body: ' + JSON.stringify(req.body, null, 4));
        userServiceComponent.getUserCount()
        .catch((error: ServiceError) => {
          throw new ApiError(500, error);
        })
        .then(count => {
          res.json({ data: count});
        })
        .catch((error: ApiError) => {
          res.status(error.status).json(error);
        });
      }
    );

    me.router.get(
      this.apiPath('/usersNoAuth'),
      function(req: Request, res: Response, next: NextFunction) {
        logger.debug('[SERVER] got GET /users, body: ' + JSON.stringify(req.body, null, 4));
        userServiceComponent.getAllUserDTOs()
        .catch((error: ServiceError) => {
          throw new ApiError(500, error);
        })
        .then(udtoarray => {
          if (udtoarray && udtoarray.length > 0) {
            let ret: IBody<IUserObject[]> = makeBody(udtoarray); 
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

    me.router.get(
      this.apiPath('/users'),
      passport.authenticate('token', {session: false}),
      this.requireAdministrator(),
      function(req: Request, res: Response, next: NextFunction) {
        logger.debug('[SERVER] got GET /users, body: ' + JSON.stringify(req.body, null, 4));
        userServiceComponent.getAllUserDTOs()
        .catch((error: ServiceError) => {
          throw new ApiError(500, error);     
        })
        .then(udtoarray => {
          if (udtoarray && udtoarray.length > 0) {
            let ret: IBody<IUserObject[]> = makeBody(udtoarray); 
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

    me.router.get(
      this.apiPath('/users/:id'),
      passport.authenticate('token', {session: false}),
      this.requireAdministrator(),
      function(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id;
        logger.debug('[SERVER] got GET /users/:id, id: ' + id + ' body: ' + JSON.stringify(req.body, null, 4));
        if (id) {
          userServiceComponent.getUserDTOByUsername(id)
          .catch((error: ServiceError) => {
            throw new ApiError(500, error);
          })
          .then(udto => {
            if (udto) {
              let ret: IBody<IUserObject> = makeBody(udto); 
              res.json(ret);
            } else {
              throw new ApiError(404, NO_USERS_FOUND.message, 'Unknown user ' + JSON.stringify(id, null, 4));
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

    me.router.post(
      this.apiPath('/users'),
      passport.authenticate('token', {session: false}),
      this.requireAdministrator(),
      function(req: Request, res: Response, next: NextFunction) {
        logger.debug('[SERVER] got POST /users, body: ' + JSON.stringify(req.body, null, 4));
        userServiceComponent.createUser(new UserAndPasswordDTO(req.body as IUserAndPasswordObject))
        .catch((error: ServiceError) => {
          throw new ApiError(500, error);      
        })
        .then((udto: UserDTO) => {
          let ret: IBody<IUserObject> = makeBody(udto); 
          res.status(201).json(ret);
        });
      }
    );

    me.router.delete(
      this.apiPath('/users/:id'),
      passport.authenticate('token', {session: false}),
      this.requireAdministrator(),
      function(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id;
        res.status(NOT_YET_IMPLEMENTED.status).json(NOT_YET_IMPLEMENTED);
      }
    );
  }
}

function serialize(req: Request, res: Response, next: NextFunction): void {
  next();
};
