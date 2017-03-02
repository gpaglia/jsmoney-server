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
 * Currencies singleton
 */
const logger = require("winston");
const typedi_1 = require("typedi");
const Config_1 = require("../_singletons/Config");
const entities_1 = require("../entities");
const jsmoney_server_api_1 = require("jsmoney-server-api");
let Currencies = class Currencies {
    constructor() {
        this.entityManager = Config_1.Config.getEntityManager();
        this.map = new Map();
        this.loadCurrencies();
    }
    getCurrency(code) {
        return this.map.get(code);
    }
    getCurrencies() {
        return Array.from(this.map.values());
    }
    loadCurrencies() {
        this.entityManager
            .find(entities_1.CurrencyEntity)
            .then((entities) => {
            logger.debug("[SERVER] loadCurrencies found " + entities.length + " items");
            for (const ce of entities) {
                const cdto = new jsmoney_server_api_1.CurrencyObject(ce.code, ce.iso, ce.description, ce.scale);
                this.map.set(cdto.code, cdto);
            }
            logger.debug("[SERVER] Currencies singleton loaded " + this.map.size);
        })
            .catch((err) => {
            logger.error("[SERVER] Error in currency loading " + err);
        });
    }
};
Currencies = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], Currencies);
exports.Currencies = Currencies;
