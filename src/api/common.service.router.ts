import * as logger from 'winston';

import { Router, Request, Response, NextFunction } from 'express';
import * as passport from 'passport';

import { Container } from 'typedi';
import { Service } from 'typedi';

import { AbstractServiceRouter } from './abstract.service.router';

import { CommonServiceComponent } from '../services/common.service.component';
import { ServiceError } from '../services/service.error';
import {
  ICurrencyObject, 
  IBody,
  makeBody
} from 'jsmoney-server-api';

import { 
  ApiError,
  NO_AUTH_ERROR,
  NO_CURRENCY_FOUND,
  NOT_YET_IMPLEMENTED,
  INTERNAL_ERROR
} from './api.error';

@Service()
export class CommonServiceRouter extends AbstractServiceRouter {

  constructor() {
    super();
  }

  protected doConfig(): void {

    // save variables in closure
    let me: CommonServiceRouter = this;
    let commonServiceComponent: CommonServiceComponent = Container.get<CommonServiceComponent>(CommonServiceComponent);

    me.router.get(
      this.apiPath('/currencies'),
      passport.authenticate('token', { session: false }),
      this.requireUser(),
      function (req: Request, res: Response, next: NextFunction) {
        let majorOrCodes: boolean | string[];
        if (req.query.major != null) {
          majorOrCodes = true;
        } else {
          majorOrCodes = req.query.codes instanceof Array ? req.query.codes : undefined;
        }
        logger.info('[SERVER] got GET /currencies, param ' 
                  + JSON.stringify(majorOrCodes, null, 4));

        commonServiceComponent.getAllCurrenciesDTO(majorOrCodes)
          .catch((error: ServiceError) => {
            throw new ApiError(500, error);
          })
          .then(cdtoarray => {
            let ret: IBody<ICurrencyObject[]> = makeBody(cdtoarray); 
            res.json(ret);
          })
          .catch((error: ApiError) => {
            res.status(error.status).json(error);
          })
      });

    me.router.get(
      this.apiPath('/currencies/:code'),
      passport.authenticate('token', { session: false }),
      this.requireUser(),
      function (req: Request, res: Response, next: NextFunction) {

        let code = req.params.code;
        logger.debug('[SERVER] got GET /currencies/:code, code: ' + code + ' body: ' + JSON.stringify(req.body, null, 4));
        if (code) {
          commonServiceComponent.getCurrencyDTOByCode(code)
            .catch((error: ServiceError) => {
              throw new ApiError(500, error);
            })
            .then(cdto => {
              if (cdto) {
                let ret: IBody<ICurrencyObject> = makeBody(cdto);
                res.json(ret);
              } else {
                throw new ApiError(404, NO_CURRENCY_FOUND.message, 'Unknown currency ' + code);
              }
            })
            .catch((error: ApiError) => {
              res.status(error.status).json(error);
            });
        } else {
          res.status(INTERNAL_ERROR.status).json(INTERNAL_ERROR);
        }
      });

      me.router.get(
      this.apiPath('/testparams'),
      function (req: Request, res: Response, next: NextFunction) {

        let params = req.params;
        let query = req.query;
        logger.debug('[SERVER] got GET /testParams, params: ' 
            + JSON.stringify(params, null, 4)
            + ', query: '
            + JSON.stringify(query, null, 4));

        res.json({params: params, query: query});
      });
  }

}
