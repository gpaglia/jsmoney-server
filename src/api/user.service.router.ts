import * as logger from 'winston';

import { Router, Request, Response, NextFunction } from 'express';
import * as passport from 'passport';

import { Container } from 'typedi';
import { Service } from 'typedi';

import { errorInfo, apiPath } from './api.helpers';

import { UserEntity } from '../entities/user.entity.model';
import { AbstractServiceRouter } from './abstract.service.router';

import { UserServiceComponent } from '../services/user.service.component';
import { ServiceError } from '../services/service.error';
import { UserDTO, UserAndPasswordDTO } from '../dto/user.dto';
import { CredentialsDTO  } from '../dto/credentials.dto';
import { IUserAndPasswordObject } from 'jsmoney-server-api';

import { HttpError } from './http.error';

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
      apiPath('/authenticate'),
      passport.authenticate('local', { session: false }),
      serialize,
      // me.generateToken,
      function (req: Request, res: Response, next: NextFunction) {
        userServiceComponent.userEntityToDTO(req.user.user)
        .catch((error: ServiceError) => {
          res.status(500).json(error);
        })
        .then(udto => {
          res.status(200).json({
            data: {
              user: udto,           // this is a user dto
              token: req.user.token // token
            }
          });
        });
      }
    );

    me.router.get(
      apiPath('/usersNoAuthcount'),
      function(req: Request, res: Response, next: NextFunction) {
        logger.debug('[SERVER] got GET /usersNoAuthCount, body: ' + JSON.stringify(req.body, null, 4));
        userServiceComponent.getUserCount()
        .catch((error: ServiceError) => {
          res.status(500).json(error);
        })
        .then(count => {
          res.json({ data: count});
        });
      }
    );

    me.router.get(
      apiPath('/usersNoAuth'),
      function(req: Request, res: Response, next: NextFunction) {
        logger.debug('[SERVER] got GET /users, body: ' + JSON.stringify(req.body, null, 4));
        userServiceComponent.getAllUserDTOs()
        .catch((error: ServiceError) => {
          res.status(500).json(error);
        })
        .then(udtoarray => {
          if (udtoarray && udtoarray.length > 0) {
            res.json({ data: udtoarray});
          } else {
            throw new HttpError(404, 'No users returned');
          }
        })
        .catch((error: HttpError) => {
          res.status(error.status).json(error);
        });
      }
    );

    me.router.get(
      apiPath('/users'),
      passport.authenticate('token', {session: false}),
      this.requireAdministrator(),
      function(req: Request, res: Response, next: NextFunction) {
        logger.debug('[SERVER] got GET /users, body: ' + JSON.stringify(req.body, null, 4));
        userServiceComponent.getAllUserDTOs()
        .catch((error: ServiceError) => {
          res.status(500).json(error);
        })
        .then(udtoarray => {
          if (udtoarray && udtoarray.length > 0) {
            res.json({ data: udtoarray});
          } else {
            throw new HttpError(404, 'No users returned');
          }
        })
        .catch((error: HttpError) => {
          res.status(error.status).json(error);
        });
      }
    );

    me.router.get(
      apiPath('/users/:id'),
      passport.authenticate('token', {session: false}),
      this.requireAdministrator(),
      function(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id;
        logger.debug('[SERVER] got GET /users/:id, id: ' + id + ' body: ' + JSON.stringify(req.body, null, 4));
        if (id) {
          userServiceComponent.getUserDTOByUsername(id)
          .catch((error: ServiceError) => {
            res.status(500).json(error);
          })
          .then(udto => {
            if (udto) {
              res.json({ data: udto });
            } else {
              throw new HttpError(404, 'Unknown user ' + JSON.stringify(id, null, 4));
            }
          })
          .catch((error: HttpError) => {
            res.status(error.status).json(error);
          });
        } else {
          res.status(500).json('Null id param');
        }
      }
    );

    me.router.post(
      apiPath('/users'),
      passport.authenticate('token', {session: false}),
      this.requireAdministrator(),
      function(req: Request, res: Response, next: NextFunction) {
        logger.debug('[SERVER] got POST /users, body: ' + JSON.stringify(req.body, null, 4));
        userServiceComponent.createUser(new UserAndPasswordDTO(req.body as IUserAndPasswordObject))
        .catch((error: ServiceError) => {
          res.status(500).json(error);
        })
        .then((udto: UserDTO) => {
          res.status(201).json({
            data: {
              user: udto
            }
          })
        });
      }
    );

    me.router.delete(
      apiPath('/users/:id'),
      passport.authenticate('token', {session: false}),
      this.requireAdministrator(),
      function(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id;
        res.status(501).json(errorInfo('Not yet implemented'));
      }
    );
  }
}

function serialize(req: Request, res: Response, next: NextFunction): void {
  next();
};
