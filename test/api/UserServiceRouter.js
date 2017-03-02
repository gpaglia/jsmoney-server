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
 * UserServiceRouter class
 */
const logger = require("winston");
const passport = require("passport");
const typedi_1 = require("typedi");
const _1 = require(".");
const services_1 = require("../services");
const jsmoney_server_api_1 = require("jsmoney-server-api");
const ApiError_1 = require("./ApiError");
let UserServiceRouter = class UserServiceRouter extends _1.AbstractServiceRouter {
    constructor() {
        super();
    }
    doConfig() {
        // save variables in closure
        // let userRepo: Repository<UserEntity> = this.connection.getRepository(UserEntity);
        const userServiceComponent = typedi_1.Container.get(services_1.UserServiceComponent);
        this.router.post(this.apiPath("/authenticate"), passport.authenticate("local", { session: false }), serialize, 
        // me.generateToken,
        (req, res) => {
            const ret = jsmoney_server_api_1.makeBody(jsmoney_server_api_1.AuthenticateDataObject.make({
                user: req.user.user,
                token: req.user.token // token
            }));
            res.status(200).json(ret);
            return;
        });
        this.router.get(this.apiPath("/usersNoAuthcount"), (req, res) => {
            logger.debug("[SERVER] got GET /usersNoAuthCount, body: " + JSON.stringify(req.body, null, 4));
            userServiceComponent.getAllUsersCount()
                .catch((error) => {
                throw new ApiError_1.ApiError(500, error);
            })
                .then((count) => {
                res.json(jsmoney_server_api_1.makeBody(count));
            })
                .catch((error) => {
                res.status(error.status).json(error);
            });
        });
        this.router.get(this.apiPath("/usersNoAuth"), (req, res) => {
            logger.debug("[SERVER] got GET /users, body: " + JSON.stringify(req.body, null, 4));
            userServiceComponent.getAllUsers()
                .catch((error) => {
                throw new ApiError_1.ApiError(500, error);
            })
                .then((objarray) => {
                if (objarray && objarray.length > 0) {
                    const ret = jsmoney_server_api_1.makeBody(objarray);
                    res.json(ret);
                }
                else {
                    throw ApiError_1.NO_USERS_FOUND;
                }
            })
                .catch((error) => {
                res.status(error.status).json(error);
            });
        });
        this.router.get(this.apiPath("/users"), passport.authenticate("token", { session: false }), this.requireAdministrator(), (req, res) => {
            logger.debug("[SERVER] got GET /users, body: " + JSON.stringify(req.body, null, 4));
            userServiceComponent.getAllUsers()
                .catch((error) => {
                throw new ApiError_1.ApiError(500, error);
            })
                .then((objarray) => {
                if (objarray && objarray.length > 0) {
                    const ret = jsmoney_server_api_1.makeBody(objarray);
                    res.json(ret);
                }
                else {
                    throw ApiError_1.NO_USERS_FOUND;
                }
            })
                .catch((error) => {
                res.status(error.status).json(error);
            });
        });
        this.router.get(this.apiPath("/users/:id"), passport.authenticate("token", { session: false }), this.requireAdministrator(), (req, res) => {
            const id = req.params.id;
            logger.debug("[SERVER] got GET /users/:id, id: " + id + " body: " + JSON.stringify(req.body, null, 4));
            if (id) {
                userServiceComponent.getOneUserByUsername(id)
                    .catch((error) => {
                    throw new ApiError_1.ApiError(500, error);
                })
                    .then((obj) => {
                    if (obj) {
                        const ret = jsmoney_server_api_1.makeBody(obj);
                        res.json(ret);
                    }
                    else {
                        throw new ApiError_1.ApiError(404, ApiError_1.NO_USERS_FOUND.message, "Unknown user " + JSON.stringify(id, null, 4));
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
        this.router.post(this.apiPath("/users"), passport.authenticate("token", { session: false }), this.requireAdministrator(), (req, res) => {
            logger.debug("[SERVER] got POST /users, body: " + JSON.stringify(req.body, null, 4));
            userServiceComponent.createOneUser(jsmoney_server_api_1.UserAndPasswordObject.make(req.body))
                .catch((error) => {
                throw new ApiError_1.ApiError(500, error);
            })
                .then((obj) => {
                const ret = jsmoney_server_api_1.makeBody(obj);
                res.status(201).json(ret);
            });
        });
        this.router.delete(this.apiPath("/users/:id"), passport.authenticate("token", { session: false }), this.requireAdministrator(), (/* req: Request, */ res) => {
            // const id = req.params.id;
            res.status(ApiError_1.NOT_YET_IMPLEMENTED.status).json(ApiError_1.NOT_YET_IMPLEMENTED);
        });
    }
};
UserServiceRouter = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], UserServiceRouter);
exports.UserServiceRouter = UserServiceRouter;
function serialize(_req, _res, next) {
    next();
}
