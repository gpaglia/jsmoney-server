import * as logger from 'winston';

import { Router, Request, Response, RequestHandler, NextFunction } from 'express';
import * as passport from 'passport';

import { Container } from 'typedi';
import { Service } from 'typedi';
import { Repository } from 'typeorm';

import { getRepository } from '../_singletons/config';

import { DatasetDTO } from '../dto/dataset.dto';
import { UserEntity } from '../entities/user.entity.model';

import { Currencies } from '../_singletons/currencies';
import { apiPath, errorInfo } from './api.helpers';
import { HttpError } from './http.error';

import { AbstractServiceRouter } from './abstract.service.router';

import { AccountServiceComponent } from '../services/account.service.component';


@Service()
export class AccountServiceRouter  extends AbstractServiceRouter {

  constructor() {
    super();
  }

  protected doConfig(): void {

    // save variables in closure
    // let userRepo: Repository<UserEntity> = this.connection.getRepository(UserEntity);
    let me: AccountServiceRouter = this;
    let accountServiceComponent: AccountServiceComponent = Container.get<AccountServiceComponent>(AccountServiceComponent);

    me.router.get(
      apiPath('/datasets'),
      passport.authenticate('token', {session: false}),
      this.requireUser(),
      function(req: Request, res: Response, next: NextFunction) {
        logger.info('[SERVER] got GET /datasets');
        let user: UserEntity = req.user;

        accountServiceComponent.getDatasetDTOsForUser(user._id)
        .catch(error => {
          res.status(500).json(errorInfo(error));
        })
        .then(ddtoarray => {
          if (ddtoarray && ddtoarray.length > 0) {
            res.json({ data: ddtoarray});
          } else {
            throw new HttpError(404, 'No datasets returned');
          }
        })
        .catch((error: HttpError) => {
          res.status(error.status).json(error);
        });
      }
    );

    me.router.post(
      apiPath('/datasets'),
      passport.authenticate('token', {session: false}),
      this.requireUser(),
      function(req: Request, res: Response, next: NextFunction) {
        logger.debug('[SERVER] got POST /datasets');
        let user: UserEntity = req.user;
        logger.debug('[SERVER] Authenticated user iso ' + JSON.stringify(user, null, 4));
        if (!req.body.data) {
          throw 'Incorrect format of request';
        }
        let ddto: DatasetDTO = req.body.data as DatasetDTO;

        logger.debug('[SERVER] Got DatasetDTO ' + JSON.stringify(ddto, null, 4));

        accountServiceComponent.createDatasetForUser(ddto, user)
        .catch(error => {
          res.status(500).json(errorInfo(error));
        })
        .then(newddto => {
          res.json({ data: newddto });
        });
      });
  }
}
