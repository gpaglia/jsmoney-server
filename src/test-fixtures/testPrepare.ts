/**
 * test prepare hooks
 */

// tslint:disable-next-line:no-var-requires no-require-imports export-name
export const prepare = require("mocha-prepare");

import {
    startup,
    teardown
} from "./setupUtils";

prepare(startup, teardown);
