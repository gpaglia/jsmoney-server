import * as logger from 'winston';

import { Express, Router }  from 'express';

import { Connection } from 'typeorm';
import { Container } from 'typedi';

import { AbstractServiceRouter } from '../api/abstract.service.router';
import { UserServiceRouter } from '../api/user.service.router';
import { CommonServiceRouter } from '../api/common.service.router';
import { AccountServiceRouter } from '../api/account.service.router';


var SERVICES: AbstractServiceRouter[] = [];

export function configRoutes() {

  let app: any = Container.get("express");
  // push all services in array (to keep context live)
  SERVICES.push(
//    new AuthService(),
    new UserServiceRouter(),
    new CommonServiceRouter(),
    new AccountServiceRouter());
  //

  logger.info('[SERVER] installing routers');
  for (let s of SERVICES) {
    app.use(s.getRouter());
  }
}
