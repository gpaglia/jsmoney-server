import * as logger from 'winston';

import { Router, Request, Response, NextFunction } from 'express';
import * as passport from 'passport';

import { Container } from 'typedi';
import { Service } from 'typedi';

import { apiPath } from './api.helpers';
import { HttpError } from './http.error';

import { AbstractServiceRouter } from './abstract.service.router';

import { CommonServiceComponent } from '../services/common.service.component';


@Service()
export class CommonServiceRouter  extends AbstractServiceRouter {

  constructor() {
    super();
  }

  protected doConfig(): void {

    // save variables in closure
    let me: CommonServiceRouter = this;
    let commonServiceComponent: CommonServiceComponent = Container.get<CommonServiceComponent>(CommonServiceComponent);

    me.router.get(apiPath('/currencies'), function(req: Request, res: Response, next: NextFunction) {
      logger.info('[SERVER] got GET /currencies');
      commonServiceComponent.getAllCurrenciesDTO()
      .catch(error => {
        res.status(500).json(error);
      })
      .then(cdtoarray => {
        res.json({ data: cdtoarray });
      });
    });
  }
}
