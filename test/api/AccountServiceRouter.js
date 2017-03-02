"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * AccountServiceRouter class
 */
const logger = require("winston");
const passport = require("passport");
const typedi_1 = require("typedi");
const jsmoney_server_api_1 = require("jsmoney-server-api");
const AbstractServiceRouter_1 = require("./AbstractServiceRouter");
const services_1 = require("../services");
const ApiError_1 = require("./ApiError");
let AccountServiceRouter = class AccountServiceRouter extends AbstractServiceRouter_1.AbstractServiceRouter {
    constructor() {
        super();
        console.log("****** AccountServiceRouter constructor *******\n\n");
    }
    doConfig() {
        // save variables in closure
        // let userRepo: Repository<UserEntity> = this.connection.getRepository(UserEntity);
        const accountServiceComponent = typedi_1.Container.get(services_1.AccountServiceComponent);
        this.router.get(this.apiPath("/datasets"), passport.authenticate("token", { session: false }), this.requireUser(), (req, res) => {
            logger.info("[SERVER] got GET /datasets");
            const user = req.user;
            accountServiceComponent.getAllDatasetsByUserId(user.id)
                .catch((error) => {
                throw new ApiError_1.ApiError(500, error);
            })
                .then((objs) => {
                if (objs && objs.length > 0) {
                    res.json(jsmoney_server_api_1.makeBody(objs));
                }
                else {
                    throw new ApiError_1.ApiError(404, "No datasets returned");
                }
            })
                .catch((error) => {
                res.status(error.status).json(error);
            });
        });
        this.router.get(this.apiPath("/datasets/:id"), passport.authenticate("token", { session: false }), this.requireUser(), (req, res) => {
            const id = req.params.id;
            logger.info("[SERVER] got GET /datasets id " + id);
            const user = req.user;
            if (id) {
                accountServiceComponent.getOneDatasetByIdAndUserId(id, user.id)
                    .catch((error) => {
                    throw new ApiError_1.ApiError(500, error);
                })
                    .then((obj) => {
                    if (obj) {
                        res.json(jsmoney_server_api_1.makeBody(obj));
                    }
                    else {
                        throw new ApiError_1.ApiError(404, "No datasets returned");
                    }
                })
                    .catch((error) => {
                    res.status(error.status).json(error);
                });
            }
            else {
                res.status(ApiError_1.INTERNAL_ERROR.status).json(ApiError_1.INTERNAL_ERROR);
            }
        });
        this.router.post(this.apiPath("/datasets"), passport.authenticate("token", { session: false }), this.requireUser(), (req, res) => {
            logger.debug("[SERVER] got POST /datasets");
            const user = req.user;
            logger.debug("[SERVER] Authenticated user iso " + JSON.stringify(user, null, 4));
            const data = jsmoney_server_api_1.getBodyData(req.body);
            if (!jsmoney_server_api_1.isDatasetObject(data) || data.userRef.id !== user.id) {
                throw "Incorrect format of request or invalid user Id";
            }
            const obj = jsmoney_server_api_1.DatasetObject.make(data);
            logger.debug("[SERVER] Got DatasetDTO " + JSON.stringify(obj, null, 4));
            accountServiceComponent.createOneDataset(obj)
                .catch((error) => {
                throw new ApiError_1.ApiError(500, error);
            })
                .then((newobj) => {
                res.json(jsmoney_server_api_1.makeBody(newobj));
            })
                .catch((error) => {
                res.status(error.status).json(error);
            });
        });
    }
};
AccountServiceRouter = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], AccountServiceRouter);
exports.AccountServiceRouter = AccountServiceRouter;
