import * as logger from 'winston';
import { Service, Inject } from 'typedi';
import { OrmConnection } from "typeorm-typedi-extensions";
import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { Connection, Repository } from 'typeorm';
import { getConfigData } from '../_singletons/config';
import { Role } from 'jsmoney-server-api';
import { UserEntity } from '../entities/user.entity.model';
import { 
  ApiError,
  NO_AUTH_ERROR,
  NO_USER_ERROR
} from './api.error';

@Service()
export abstract class AbstractServiceRouter {
  @OrmConnection(getConfigData().database.name)
  protected connection: Connection;
  protected router: Router;
  protected configData: any;

  constructor() {
    this.router = Router();
    this.configData = getConfigData();
    this.doConfig();
  }

  protected apiPath(path: string): string {
    return this.configData.api.base + this.configData.api.version + path; 
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
        let apiError = new ApiError(500, 'No user or no role in request');
        res.status(NO_USER_ERROR.status).json(NO_USER_ERROR);
      } else if (user.role >= role) {
        next();
      } else {
        res.status(NO_AUTH_ERROR.status).json(NO_AUTH_ERROR);
      }
    }
  }
}
