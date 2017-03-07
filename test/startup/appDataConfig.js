"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * App Data Config
 */
const loadCurrencyData_1 = require("../_initializers/loadCurrencyData");
const loadUserData_1 = require("../_initializers/loadUserData");
function appDataConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.resolve()
            .then(() => loadCurrencyData_1.loadCurrencyData())
            .then(() => loadUserData_1.loadUserData())
            .then(() => {
            return null;
        });
    });
}
exports.appDataConfig = appDataConfig;
