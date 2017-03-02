/**
 * Routes config
 */
import * as logger from "winston";

import { Container } from "typedi";

import {
  AbstractServiceRouter,
  AccountServiceRouter,
  CommonServiceRouter,
  UserServiceRouter
} from "../api";

const SERVICES: AbstractServiceRouter[] = [];

export function configRoutes(): void {

  // tslint:disable-next-line:no-any
  const app: any = Container.get("express");
  // push all services in array (to keep context live)
  SERVICES.push(
//    new AuthService(),
    Container.get(UserServiceRouter),
    Container.get(CommonServiceRouter),
    Container.get(AccountServiceRouter)
  );
  //

  logger.info("[SERVER] installing routers");
  for (const s of SERVICES) {
    app.use(s.getRouter());
  }
}
