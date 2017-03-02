"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Passport startup file
 */
const logger = require("winston");
const passport = require("passport");
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const jwtp = require("passport-jwt");
const jwt = require("jsonwebtoken");
const typedi_1 = require("typedi");
const services_1 = require("../services");
const Config_1 = require("../_singletons/Config");
const jsmoney_server_api_1 = require("jsmoney-server-api");
const config = typedi_1.Container.get(Config_1.Config);
const expiration = config.data().passport.expiration;
const jwtParams = {
    secretOrKey: config.data().passport.secret,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeader(),
    algorithms: ["HS256"]
};
function makeToken(user) {
    const x = jwt.sign({
        id: user.id,
        username: user.username,
        role: user.role
    }, jwtParams.secretOrKey, {
        expiresIn: expiration,
        algorithm: "HS256"
    });
    const y = jwt.verify(x, jwtParams.secretOrKey);
    logger.info("[SERVER] u = " + JSON.stringify(user));
    logger.info("[SERVER] x = " + x);
    logger.info("[SERVER] y = " + JSON.stringify(y, null, 4));
    return jsmoney_server_api_1.BEARER + " " + x;
}
exports.makeToken = makeToken;
function passportConfig() {
    logger.info("[SERVER] Starting passport configuration");
    const userServiceComponent = typedi_1.Container.get(services_1.UserServiceComponent);
    // tslint:disable-next-line:no-any
    const validateUsernamePassword = (uname, pwd, done) => {
        userServiceComponent.validateUserByCredentials(new jsmoney_server_api_1.CredentialsObject(uname, pwd))
            .then((info) => {
            if (info.status === services_1.ValidationStatus.Validated) {
                const token = makeToken(info.user);
                done(null, { user: info.user, token });
            }
            else if (info.status === services_1.ValidationStatus.NoUser) {
                done(null, false, { message: "Unknown user" });
            }
            else if (info.status === services_1.ValidationStatus.WrongPassword) {
                done(null, false, { message: "Incorrect password" });
            }
        })
            .catch((err) => {
            done(err);
        });
    };
    // tslint:disable-next-line:no-any
    const validateToken = (payload, done) => {
        logger.info("[SERVER] In token Strategy: Got payload " + JSON.stringify(payload));
        if (payload && payload.id && payload.username && payload.role) {
            const id = payload.id;
            userServiceComponent.getOneUserById(id)
                .then((user) => {
                logger.info("[SERVER] In Strategy: Got user by id" + JSON.stringify(user));
                done(null, user);
            })
                .catch((err) => {
                logger.info("[SERVER] Error in findoneuser, " + JSON.stringify(err));
                done(err);
            });
        }
        else {
            logger.info("[SERVER] other error");
            done("Something got wrong in validateToken");
        }
    };
    passport.use("local", new passport_local_1.Strategy(validateUsernamePassword));
    passport.use("token", new jwtp.Strategy(jwtParams, validateToken));
}
exports.passportConfig = passportConfig;
