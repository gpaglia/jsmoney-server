/**
 * CommonServiceRouter class
 */
import * as logger from "winston";

import {
  Request,
  Response
} from "express";

import * as passport from "passport";

import { Container } from "typedi";
import { Service } from "typedi";

import { AbstractServiceRouter } from ".";

import {
  CommonServiceComponent,
  ServiceError
} from "../services";

import {
  Body,
  CurrencyObject,
  makeBody
} from "jsmoney-server-api";

import {
  ApiError,
  INTERNAL_ERROR,
  NO_CURRENCY_FOUND
} from "./ApiError";

@Service()
export class CommonServiceRouter extends AbstractServiceRouter {

  constructor() {
    super();
  }

  protected doConfig(): void {

    // save variables in closure
    const commonServiceComponent: CommonServiceComponent = Container.get<CommonServiceComponent>(CommonServiceComponent);

    this.router.get(
      this.apiPath("/currencies"),
      passport.authenticate("token", { session: false }),
      this.requireUser(),
      (req: Request, res: Response) => {
        let majorOrCodes: boolean | string[];
        if (req.query.major != null) {
          majorOrCodes = true;
        } else {
          majorOrCodes = req.query.codes instanceof Array ? req.query.codes : undefined;
        }
        logger.info("[SERVER] got GET /currencies, param "
          + JSON.stringify(majorOrCodes, null, 4));

        commonServiceComponent.getAllCurrencies(majorOrCodes)
          .catch((error: ServiceError) => {
            throw new ApiError(500, error);
          })
          .then((objs) => {
            const ret: Body<CurrencyObject[]> = makeBody(objs);
            res.json(ret);
          })
          .catch((error: ApiError) => {
            res.status(error.status).json(error);
          });
      });

    this.router.get(
      this.apiPath("/currencies/:code"),
      passport.authenticate("token", { session: false }),
      this.requireUser(),
      (req: Request, res: Response) => {

        const code = req.params.code;
        logger.debug("[SERVER] got GET /currencies/:code, code: " + code + " body: " + JSON.stringify(req.body, null, 4));
        if (code) {
          commonServiceComponent.getOneCurrencyByCode(code)
            .catch((error: ServiceError) => {
              throw new ApiError(500, error);
            })
            .then((obj) => {
              if (obj) {
                const ret: Body<CurrencyObject> = makeBody(obj);
                res.json(ret);
              } else {
                throw new ApiError(404, NO_CURRENCY_FOUND.message, "Unknown currency " + code);
              }
            })
            .catch((error: ApiError) => {
              res.status(error.status).json(error);
            });
        } else {
          res.status(INTERNAL_ERROR.status).json(INTERNAL_ERROR);
        }
      });

    this.router.get(
      this.apiPath("/testparams"),
      (req: Request, res: Response) => {

        const params = req.params;
        const query = req.query;
        logger.debug("[SERVER] got GET /testParams, params: "
          + JSON.stringify(params, null, 4)
          + ", query: "
          + JSON.stringify(query, null, 4));

        res.json({ params, query });
      });
  }

}
