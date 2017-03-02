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
 * CommonServiceRouter class
 */
const logger = require("winston");
const passport = require("passport");
const typedi_1 = require("typedi");
const typedi_2 = require("typedi");
const _1 = require(".");
const services_1 = require("../services");
const jsmoney_server_api_1 = require("jsmoney-server-api");
const ApiError_1 = require("./ApiError");
let CommonServiceRouter = class CommonServiceRouter extends _1.AbstractServiceRouter {
    constructor() {
        super();
    }
    doConfig() {
        // save variables in closure
        const commonServiceComponent = typedi_1.Container.get(services_1.CommonServiceComponent);
        this.router.get(this.apiPath("/currencies"), passport.authenticate("token", { session: false }), this.requireUser(), (req, res) => {
            let majorOrCodes;
            if (req.query.major != null) {
                majorOrCodes = true;
            }
            else {
                majorOrCodes = req.query.codes instanceof Array ? req.query.codes : undefined;
            }
            logger.info("[SERVER] got GET /currencies, param "
                + JSON.stringify(majorOrCodes, null, 4));
            commonServiceComponent.getAllCurrencies(majorOrCodes)
                .catch((error) => {
                throw new ApiError_1.ApiError(500, error);
            })
                .then((objs) => {
                const ret = jsmoney_server_api_1.makeBody(objs);
                res.json(ret);
            })
                .catch((error) => {
                res.status(error.status).json(error);
            });
        });
        this.router.get(this.apiPath("/currencies/:code"), passport.authenticate("token", { session: false }), this.requireUser(), (req, res) => {
            const code = req.params.code;
            logger.debug("[SERVER] got GET /currencies/:code, code: " + code + " body: " + JSON.stringify(req.body, null, 4));
            if (code) {
                commonServiceComponent.getOneCurrencyByCode(code)
                    .catch((error) => {
                    throw new ApiError_1.ApiError(500, error);
                })
                    .then((obj) => {
                    if (obj) {
                        const ret = jsmoney_server_api_1.makeBody(obj);
                        res.json(ret);
                    }
                    else {
                        throw new ApiError_1.ApiError(404, ApiError_1.NO_CURRENCY_FOUND.message, "Unknown currency " + code);
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
        this.router.get(this.apiPath("/testparams"), (req, res) => {
            const params = req.params;
            const query = req.query;
            logger.debug("[SERVER] got GET /testParams, params: "
                + JSON.stringify(params, null, 4)
                + ", query: "
                + JSON.stringify(query, null, 4));
            res.json({ params, query });
        });
    }
};
CommonServiceRouter = __decorate([
    typedi_2.Service(),
    __metadata("design:paramtypes", [])
], CommonServiceRouter);
exports.CommonServiceRouter = CommonServiceRouter;
