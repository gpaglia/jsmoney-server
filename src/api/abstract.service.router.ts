import * as logger from 'winston';
import { Service, Inject } from 'typedi';
import { OrmConnection } from "typeorm-typedi-extensions";
import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { Connection, Repository } from 'typeorm';
import { getConfigData } from '../_singletons/config';
import { errorInfo, apiPath } from './api.helpers';
import { Role } from 'jsmoney-server-api';
import { UserEntity } from '../entities/user.entity.model';


@Service()
export abstract class AbstractServiceRouter {
  @OrmConnection(getConfigData().database.name)
  protected connection: Connection;
  protected router: Router;

  constructor() {
    this.router = Router();
    this.doConfig();
  }

  public getRouter(): Router {
    return this.router;
  }

  protected abstract doConfig(): void;

  protected requireAdministrator(): RequestHandler {
    return this.requireRole(Role.administrator);
  }

  protected requireUser(): RequestHandler {
    return this.requireRole(Role.user);
  }

  protected requireGuest(): RequestHandler {
    return this.requireRole(Role.guest);
  }

  protected requireRole(role: Role): RequestHandler {
    return function(req: Request, res: Response, next: NextFunction): void {
      let user: UserEntity = req.user as UserEntity;
      logger.debug('[SERVER] requireRole: ' + role + ' , user: ' + JSON.stringify(user, null, 4));
      if (! user || !user.role) {
        res.status(500).json(errorInfo('No user or no role in request'));
      } else if (user.role >= role) {
        next();
      } else {
        res.status(401).json(errorInfo('Insufficient authorization for requested function'))
      }
    }
  }
}
