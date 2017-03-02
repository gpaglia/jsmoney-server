"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * App Data Config
 */
const loadCurrencyData_1 = require("../_initializers/loadCurrencyData");
const loadUserData_1 = require("../_initializers/loadUserData");
function appDataConfig() {
    return Promise.resolve()
        .then(() => loadCurrencyData_1.loadCurrencyData())
        .then(() => loadUserData_1.loadUserData())
        .then(() => {
        return null;
    });
}
exports.appDataConfig = appDataConfig;
