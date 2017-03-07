/**
 * AccountServiceRouter class
 */
import * as logger from "winston";

import {
  Request,
  Response
 } from "express";

import * as passport from "passport";

import {
  Container,
  Service
} from "typedi";

import {
  DatasetObject,
  getBodyData,
  IDatasetObject,
  isDatasetObject,
  makeBody,
  UserObject
} from "jsmoney-server-api";

import { UserEntity } from "../entities";

import { AbstractServiceRouter } from "./AbstractServiceRouter";

import {
  AccountServiceComponent,
  ServiceError
} from "../services";

import {
  ApiError,
  INTERNAL_ERROR
} from "./ApiError";

@Service()
export class AccountServiceRouter extends AbstractServiceRouter {

  constructor() {
    super();
    console.log("****** AccountServiceRouter constructor *******\n\n");
  }

  protected doConfig(): void {

    // save variables in closure
    // let userRepo: Repository<UserEntity> = this.connection.getRepository(UserEntity);
    const accountServiceComponent: AccountServiceComponent = Container.get<AccountServiceComponent>(AccountServiceComponent);

    this.router.get(
      this.apiPath("/datasets"),
      passport.authenticate("token", { session: false }),
      this.requireUser(),
      (req: Request, res: Response) => {
        logger.info("[SERVER] got GET /datasets");
        const user: UserEntity = req.user;

        accountServiceComponent.getAllDatasetsByUserId(user.id)
          .catch((error: ServiceError) => {
            throw new ApiError(500, error);
          })
          .then((objs: DatasetObject[]) => {
            if (objs && objs.length > 0) {
              res.json(makeBody(objs));
            } else {
              throw new ApiError(404, "No datasets returned");
            }
          })
          .catch((error: ApiError) => {
            res.status(error.status).json(error);
          });
      }
    );

    this.router.get(
      this.apiPath("/datasets/:id"),
      passport.authenticate("token", { session: false }),
      this.requireUser(),
      (req: Request, res: Response) => {
        const id = req.params.id;
        logger.info("[SERVER] got GET /datasets id " + id);
        const user: UserObject = req.user;
        if (id) {
          accountServiceComponent.getOneDatasetByIdAndUserId(id, user.id)
            .catch((error: ServiceError) => {
              throw new ApiError(500, error);
            })
            .then((obj: DatasetObject) => {
              if (obj) {
                res.json(makeBody(obj));
              } else {
                throw new ApiError(404, "No datasets returned");
              }
            })
            .catch((error: ApiError) => {
              res.status(error.status).json(error);
            });

        } else {
          res.status(INTERNAL_ERROR.status).json(INTERNAL_ERROR);
        }

      }
    );

    this.router.post(
      this.apiPath("/datasets"),
      passport.authenticate("token", { session: false }),
      this.requireUser(),
      (req: Request, res: Response) => {
        logger.debug("[SERVER] got POST /datasets");
        const user: UserObject = req.user;
        logger.debug("[SERVER] Authenticated user iso " + JSON.stringify(user, null, 4));
        const data: IDatasetObject = getBodyData<IDatasetObject>(req.body);
        if (!isDatasetObject(data) || data.userId !== user.id) {
          throw "Incorrect format of request or invalid user Id";
        }
        const obj: DatasetObject = DatasetObject.make(data);

        logger.debug("[SERVER] Got DatasetDTO " + JSON.stringify(obj, null, 4));

        accountServiceComponent.createOneDataset(obj)
          .catch((error) => {
            throw new ApiError(500, error);
          })
          .then((newobj) => {
            res.json(makeBody(newobj));
          })
          .catch((error: ApiError) => {
            res.status(error.status).json(error);
          });
      });
  }
}
