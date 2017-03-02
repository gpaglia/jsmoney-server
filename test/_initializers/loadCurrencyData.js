"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Currency Data initializer
 */
const logger = require("winston");
const Config_1 = require("../_singletons/Config");
const entities_1 = require("../entities");
const jsmoney_server_api_1 = require("jsmoney-server-api");
// tslint:disable-next-line:no-any no-var-requires no-require-imports
// const countries: any[] = require("../_data/currency.country.data.js");
const countryData_1 = require("../_data/countryData");
function defaultCurrencies() {
    const currencies = new Map();
    countryData_1.countryData.forEach((cd) => {
        const cdto = new jsmoney_server_api_1.CurrencyObject(cd.currency_alphabetic_code, cd.currency_numeric_code, cd.currency_name, Number.parseInt(cd.currency_minor_unit));
        if (cdto.isValid()) {
            currencies.set(cdto.code, cdto);
        }
        else {
            logger.info("[SERVER] Currency not imported, " + JSON.stringify(cdto, null, 4));
        }
    });
    return currencies;
}
function loadCurrencyData() {
    // const cm: ConnectionManager = Container.get<ConnectionManager>(ConnectionManager);
    const entityManager = Config_1.Config.getEntityManager();
    return entityManager
        .findAndCount(entities_1.CurrencyEntity)
        .then((value) => {
        const cnt = value[1];
        if (cnt === 0) {
            let nloaded = 0;
            for (const c of defaultCurrencies().values()) {
                const newC = new entities_1.CurrencyEntity(c.code, c.iso, c.description, c.scale);
                entityManager.persist(newC);
                nloaded = nloaded + 1;
            }
            logger.info("[SERVER] Initialized currency data with " + nloaded + " currencies");
        }
        else {
            logger.info("[SERVER] Currencies already in db, not loaded");
        }
    })
        .catch((err) => {
        logger.error("[SERVER] Error in currency loading " + err);
    });
}
exports.loadCurrencyData = loadCurrencyData;
