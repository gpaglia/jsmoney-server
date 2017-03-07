"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default user data loader
 */
const logger = require("winston");
const uuid = require("uuid");
const services_1 = require("../services");
const typedi_1 = require("typedi");
const jsmoney_server_api_1 = require("jsmoney-server-api");
// tslint:disable-next-line:no-any
const defaultUsers = [
    {
        user: {
            id: uuid.v4(),
            version: 0,
            username: "admin",
            firstName: "...",
            lastName: "...",
            email: "admin@domain.com",
            role: jsmoney_server_api_1.Role.administrator
        },
        password: "Password"
    },
    {
        user: {
            id: uuid.v4(),
            version: 0,
            username: "user",
            firstName: "...",
            lastName: "...",
            email: "user@domain.com",
            role: jsmoney_server_api_1.Role.user
        },
        password: "Password"
    }
];
function loadUserData() {
    const userServiceComponent = typedi_1.Container.get(services_1.UserServiceComponent);
    return userServiceComponent
        .getAllUsersCount()
        .catch((error) => {
        logger.error("[SERVER] Error in user initialization loading " + JSON.stringify(error, null, 4));
    })
        .then((count) => {
        console.log("Users in DB: ", count);
        if (count === 0) {
            // tslint:disable-next-line:prefer-array-literal
            const parray = [];
            for (const iuser of defaultUsers) {
                const udto = jsmoney_server_api_1.UserAndPasswordObject.make(iuser);
                if (udto.isValid()) {
                    parray.push(userServiceComponent.createOneUser(udto));
                }
                else {
                    logger.error("[SERVER] Loading users, user skipped (" + JSON.stringify(udto) + ")");
                }
            }
            logger.info("[SERVER] Loading users (" + parray.length + ")");
            return Promise.all(parray);
        }
        else {
            logger.info("[SERVER] Users already in db, not loaded");
            return Promise.resolve([]);
        }
    });
}
exports.loadUserData = loadUserData;
