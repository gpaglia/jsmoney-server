/**
 * test prepare hooks
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires no-require-imports export-name
exports.prepare = require("mocha-prepare");
const setupUtils_1 = require("./setupUtils");
exports.prepare(setupUtils_1.startup, setupUtils_1.teardown);
