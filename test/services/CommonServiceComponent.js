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
 * CommonServiceComponent class
 */
const logger = require("winston");
const typedi_1 = require("typedi");
const _1 = require(".");
const jsmoney_server_api_1 = require("jsmoney-server-api");
const entities_1 = require("../entities");
const _2 = require(".");
const MAJOR_CURRENCIES = [
    "EUR",
    "USD",
    "GBP",
    "JPY",
    "CAN"
];
let CommonServiceComponent = class CommonServiceComponent extends _1.AbstractServiceComponent {
    constructor() {
        super();
        this.currencyCache = null;
    }
    getAllCurrenciesCount() {
        return this.getFromCacheOrLoad().then((map) => {
            console.log("************* MAP SIZE IN GET ", map.size);
            return map.size;
        });
    }
    getAllCurrencies(majorOrCodes) {
        let major;
        let codes;
        if (arguments.length === 0) {
            major = false;
            codes = undefined;
        }
        else if (majorOrCodes instanceof Array) {
            codes = majorOrCodes;
            major = false;
        }
        else {
            codes = undefined;
            major = majorOrCodes;
        }
        return this.getFromCacheOrLoad()
            .then((map) => {
            if (major) {
                return Array.from(map.values()).filter((c) => MAJOR_CURRENCIES.indexOf(c.code) >= 0);
            }
            else {
                return Array.from(map.values()).filter((c) => (codes == null) || (codes.indexOf(c.code) >= 0));
            }
        });
    }
    getAllMajorCurrencyCodes() {
        return Promise.resolve(MAJOR_CURRENCIES);
    }
    getOneCurrencyByCode(code) {
        return this.getFromCacheOrLoad()
            .then((map) => { return map.get(code); });
    }
    getMultipleCurrenciesByCode(codes) {
        return this.getAllCurrencies(codes);
    }
    clearCurrencyCache() {
        this.currencyCache = null;
    }
    createOneCurrency(cobj) {
        if (cobj.isValid()) {
            return this.entityManager.persist(new entities_1.CurrencyEntity(cobj));
        }
        else {
            throw new _2.ServiceError("Invalid CurrencyObject", cobj);
        }
    }
    createMultipleCurrencies(cobjs) {
        return this.entityManager.persist(cobjs
            .filter((cobj) => cobj.isValid())
            .map((cobj) => new entities_1.CurrencyEntity(cobj)));
    }
    getFromCacheOrLoad() {
        if (this.currencyCache == null || this.currencyCache.size === 0) {
            logger.debug("[SERVER] getFromCacheOrLoad() Cache miss!");
            return this.entityManager
                .find(entities_1.CurrencyEntity)
                .then((carray) => {
                if (carray.length > 0) {
                    this.currencyCache = new Map(carray.map((c) => {
                        return [c.code, jsmoney_server_api_1.CurrencyObject.make(c)];
                    }));
                }
                else {
                    this.currencyCache = new Map();
                }
                console.log("************** MAP SIZE", this.currencyCache.size);
                return this.currencyCache;
            })
                .catch((error) => {
                throw new _2.ServiceError("Error in loading currency cache", error);
            });
        }
        else {
            logger.debug("[SERVER] getFromCacheOrLoad() Cache hit!");
            return Promise.resolve(this.currencyCache);
        }
    }
};
CommonServiceComponent = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], CommonServiceComponent);
exports.CommonServiceComponent = CommonServiceComponent;
