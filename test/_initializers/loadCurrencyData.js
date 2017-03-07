"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Currency Data initializer
 */
const logger = require("winston");
const typedi_1 = require("typedi");
const jsmoney_server_api_1 = require("jsmoney-server-api");
const services_1 = require("../services");
// tslint:disable-next-line:no-any no-var-requires no-require-imports
// const countries: any[] = require("../_data/currency.country.data.js");
const countryData_1 = require("../_data/countryData");
function defaultCurrencies() {
    const map = {};
    const out = [];
    // get unique values
    countryData_1.countryData.forEach((cd) => {
        const co = new jsmoney_server_api_1.CurrencyObject(cd.currency_alphabetic_code, cd.currency_numeric_code, cd.currency_name, Number.parseInt(cd.currency_minor_unit));
        if (co.isValid() && !map[co.code]) {
            out.push(co);
            map[co.code] = true;
        }
    });
    return out;
}
function loadCurrencyData() {
    // const cm: ConnectionManager = Container.get<ConnectionManager>(ConnectionManager);
    const svc = typedi_1.Container.get(services_1.CommonServiceComponent);
    return svc.getAllCurrenciesCount()
        .then((cnt) => {
        if (cnt == null) {
            console.log("[SERVER] getAllCurrenciesCount() returned undefined in loadCurrencyData");
            throw ("[SERVER] getAllCurrenciesCount() returned undefined in loadCurrencyData");
        }
        else if (cnt === 0) {
            return svc.createMultipleCurrencies(defaultCurrencies())
                .then((objs) => {
                logger.info("[SERVER] Initialized currency data with " + objs.length + " currencies");
                return objs.length;
            });
        }
        else {
            logger.info("[SERVER] Currencies already in db, not loaded");
            return 0;
        }
    })
        .catch((err) => {
        logger.error("[SERVER] Error in currency loading " + err);
        throw ("[SERVER] Error in currency loading ");
    });
}
exports.loadCurrencyData = loadCurrencyData;
