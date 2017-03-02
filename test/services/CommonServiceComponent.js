/**
 * CommonServiceComponent class
 */
// import * as logger from "winston";
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
const typedi_1 = require("typedi");
const _1 = require(".");
const Currencies_1 = require("../_singletons/Currencies");
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
        const curdata = this.currencies
            .getCurrencies()
            .filter((cdto) => {
            if (major) {
                return (MAJOR_CURRENCIES.indexOf(cdto.code) >= 0);
            }
            else {
                return ((codes == null) || (codes.indexOf(cdto.code) >= 0));
            }
        });
        return Promise.resolve(curdata);
    }
    getAllMajorCurrencyCodes() {
        return Promise.resolve(MAJOR_CURRENCIES);
    }
    getOneCurrencyByCode(code) {
        return Promise.resolve(this.currencies.getCurrency(code));
    }
    getMultipleCurrenciesByCode(codes) {
        return Promise.resolve(this.currencies.getCurrencies().filter((cdto) => {
            return (codes.indexOf(cdto.code) >= 0);
        }));
    }
};
__decorate([
    typedi_1.Inject(),
    __metadata("design:type", Currencies_1.Currencies)
], CommonServiceComponent.prototype, "currencies", void 0);
CommonServiceComponent = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], CommonServiceComponent);
exports.CommonServiceComponent = CommonServiceComponent;
