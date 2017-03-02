"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Express config file
 */
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const path = require("path");
const logger = require("winston");
const configRoutes = require("./configRoutes");
const passportConfig_1 = require("./passportConfig");
const typedi_1 = require("typedi");
const Config_1 = require("../_singletons/Config");
function expressConfig() {
    // tslint:disable-next-line:no-any
    const configData = Config_1.Config.getConfigData();
    const app = express();
    const router = express.Router();
    typedi_1.Container.set("express", app);
    return Promise.resolve()
        .then(() => {
        logger.info("[SERVER] express in startServer is " + JSON.stringify(app, null, 4));
        logger.info("[SERVER] router in startServer is " + JSON.stringify(router, null, 4));
        app.use(morgan("common"));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({ type: "*/*" }));
        logger.info("[SERVER] Initializing passport");
        passportConfig_1.passportConfig();
        app.use(passport.initialize());
        logger.info("[SERVER] Initializing routes");
        app.use(express.static(path.join(__dirname, "public")));
        /*
              // Enable CORS
        
              app.use(function (req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                next();
              });
        */
        app.use(cors());
        // Error handler
        // tslint:disable-next-line:no-any
        app.use((err, _req, res, next) => {
            res.status(err.status || 500);
            res.json({
                message: err.message,
                error: (app.get("env") === "development" ? err : {})
            });
            next(err);
        });
        // Config application routes
        configRoutes.configRoutes();
        app.listen(configData.port);
        logger.info("[SERVER] Listening on port " + configData.port);
    });
}
exports.expressConfig = expressConfig;
