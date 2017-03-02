/**
 * AbstractServiceRouter class
 */
import * as logger from "winston";

import { Service } from "typedi";

import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router
} from "express";

import { Connection } from "typeorm";

import { Config } from "../_singletons/Config";

import { Role } from "jsmoney-server-api";

import { UserEntity } from "../entities";

import {
  NO_AUTH_ERROR,
  NO_USER_ERROR
} from "./ApiError";

@Service()
export abstract class AbstractServiceRouter {
  protected connection: Connection;
  protected router: Router;
  // tslint:disable-next-line:no-any
  protected configData: any;

  constructor() {
    this.router = Router();
    this.configData = Config.getConfigData();
    this.connection = Config.getConnection();
    this.doConfig();
  }

  public getRouter(): Router {
    return this.router;
  }

  protected apiPath(path: string): string {
    return this.configData.api.base + this.configData.api.version + path;
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
    return (req: Request, res: Response, next: NextFunction): void => {
      const user: UserEntity = req.user as UserEntity;
      logger.debug("[SERVER] requireRole: " + role + " , user: " + JSON.stringify(user, null, 4));
      if (!user || !user.role) {
        res.status(NO_USER_ERROR.status).json(NO_USER_ERROR);
      } else if (user.role >= role) {
        next();
      } else {
        res.status(NO_AUTH_ERROR.status).json(NO_AUTH_ERROR);
      }
    };
  }
}
