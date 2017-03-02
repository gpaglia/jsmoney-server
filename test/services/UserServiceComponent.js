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
 * UserServiceComponent class
 */
const logger = require("winston");
const typedi_1 = require("typedi");
const _1 = require(".");
const entities_1 = require("../entities");
const jsmoney_server_api_1 = require("jsmoney-server-api");
var ValidationStatus;
(function (ValidationStatus) {
    ValidationStatus[ValidationStatus["Validated"] = 0] = "Validated";
    ValidationStatus[ValidationStatus["NoUser"] = 1] = "NoUser";
    ValidationStatus[ValidationStatus["WrongPassword"] = 2] = "WrongPassword";
    ValidationStatus[ValidationStatus["InvalidData"] = 3] = "InvalidData";
})(ValidationStatus = exports.ValidationStatus || (exports.ValidationStatus = {}));
class ValidationInfo {
    constructor(status, user) {
        this.status = status;
        this.user = user;
    }
}
exports.ValidationInfo = ValidationInfo;
// tslint:disable-next-line:max-classes-per-file
let UserServiceComponent = class UserServiceComponent extends _1.AbstractServiceComponent {
    constructor() {
        super();
    }
    validateUserByCredentials(cred) {
        return cred.isValid() ? this.getOneUserEntityByConditions({ username: cred.username })
            .then((entity) => {
            if (!entity) {
                return new ValidationInfo(ValidationStatus.NoUser, undefined);
            }
            else if (cred.password === entity.password) {
                return new ValidationInfo(ValidationStatus.Validated, jsmoney_server_api_1.UserObject.make(entity));
            }
            else {
                return new ValidationInfo(ValidationStatus.WrongPassword, undefined);
            }
        })
            .catch((error) => {
            throw new _1.ServiceError("Error in validateUserByCredentials", error);
        }) : Promise.resolve(new ValidationInfo(ValidationStatus.InvalidData, undefined));
    }
    getOneUserEntityByConditions(conditions) {
        return this.connection
            .getRepository(entities_1.UserEntity)
            .findOne(conditions)
            .catch((error) => {
            throw new _1.ServiceError("Error in getOneUserEntityByConditions", error);
        });
    }
    getOneUserByConditions(conditions) {
        return this.getOneUserEntityByConditions(conditions)
            .then((ue) => {
            return jsmoney_server_api_1.UserObject.make(ue);
        });
    }
    getOneUserEntityByUsername(uname) {
        return this.getOneUserEntityByConditions({ username: uname });
    }
    getOneUserByUsername(uname) {
        return this.getOneUserByConditions({ username: uname });
    }
    getOneUserEntityByUsernameAndPassword(uname, pwd) {
        return this.getOneUserEntityByConditions({ username: uname, password: pwd });
    }
    getOneUserByUsernameAndPassword(uname, pwd) {
        return this.getOneUserByConditions({ username: uname, password: pwd });
    }
    getOneUserEntityById(uid) {
        return this.getOneUserEntityByConditions({ id: uid });
    }
    getOneUserById(uid) {
        return this.getOneUserByConditions({ id: uid });
    }
    getAllUserEntities() {
        return this.connection
            .getRepository(entities_1.UserEntity)
            .find()
            .catch((error) => {
            throw new _1.ServiceError("Error in getAllUserEntities", error);
        });
    }
    getAllUsers() {
        return this.getAllUserEntities().then((uea) => {
            return uea.map((ue) => {
                return jsmoney_server_api_1.UserObject.make(ue);
            });
        });
    }
    getAllUsersCount() {
        return this.connection
            .getRepository(entities_1.UserEntity)
            .findAndCount()
            .catch((error) => {
            throw new _1.ServiceError("Error in getUserCount", error);
        })
            .then((result) => {
            logger.debug("[SERVER] User count is " + result[1]);
            return result[1];
        });
    }
    createOneUser(obj) {
        if (obj.isValid()) {
            const newUser = new entities_1.UserEntity(obj);
            return this.connection
                .getRepository(entities_1.UserEntity)
                .persist(newUser)
                .catch((error) => {
                throw new _1.ServiceError("Error in createUser", error);
            })
                .then((entity) => {
                return jsmoney_server_api_1.UserObject.make(entity);
            });
        }
        else {
            return Promise.reject(new _1.ServiceError("Error in createUser, invalid user data or null password"));
        }
    }
};
UserServiceComponent = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], UserServiceComponent);
exports.UserServiceComponent = UserServiceComponent;
