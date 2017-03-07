/**
 * AccountServiceComponent
 */
// import * as logger from "winston";
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
const typedi_1 = require("typedi");
const entities_1 = require("../entities");
const jsmoney_server_api_1 = require("jsmoney-server-api");
const _1 = require(".");
let AccountServiceComponent = class AccountServiceComponent extends _1.AbstractServiceComponent {
    constructor() {
        super();
    }
    getOneDatasetEntityById(did) {
        return this.getOneDatasetEntityByConditions({ id: did });
    }
    getOneDatasetById(did) {
        return this.getOneDatasetByConditions({ id: did });
    }
    getOneDatasetEntityByIdAndUserId(did, uid) {
        return this.getOneDatasetEntityByUserIdAndConditions(uid, { id: did });
    }
    getOneDatasetByIdAndUserId(did, uid) {
        return this.getOneDatasetByUserIdAndConditions(uid, { id: did });
    }
    getAllDatasetsByUserId(uid) {
        return this.connection
            .getRepository(entities_1.DatasetEntity)
            .find({
            alias: "dataset",
            innerJoin: {
                user: "dataset.user"
            },
            where: "user._id = '" + uid + "'"
        })
            .then((dsa) => {
            return dsa.map((ds) => {
                return jsmoney_server_api_1.DatasetObject.make(ds);
            });
        })
            .catch((error) => {
            throw new _1.ServiceError("Error in getDatasetEntitiesForUser", error);
        });
    }
    createOneDataset(obj) {
        if (obj.isValid()) {
            return this.userService.getOneUserEntityByConditions({ id: obj.userId })
                .then((ue) => {
                const entity = new entities_1.DatasetEntity(obj, ue);
                return this.connection
                    .getRepository(entities_1.DatasetEntity)
                    .persist(entity);
            })
                .then((newe) => {
                return Promise.resolve(jsmoney_server_api_1.DatasetObject.make(newe));
            })
                .catch((error) => {
                throw new _1.ServiceError("Error in createDatasetForUser", error);
            });
        }
        else {
            return Promise.reject(new _1.ServiceError("Validation of DatasetObject failed", obj));
        }
    }
    // Private methods
    getOneDatasetEntityByUserIdAndConditions(userId, conditions) {
        const dsalias = "dataset";
        const ualias = "user";
        return this.connection
            .getRepository(entities_1.DatasetEntity)
            .createQueryBuilder("dataset")
            .innerJoin("dataset.user", "user")
            .where(this.createSelectionParam(dsalias, conditions))
            .andWhere(this.createSelectionParam(ualias, { id: ":uid" }))
            .setParameter("uid", userId)
            .getManyAndCount()
            .then((t) => {
            if (t[1] === 0) {
                return [];
            }
            else if (t[1] === 1) {
                return t[0][0];
            }
            else {
                throw new _1.ServiceError("Multiple datasets returned by query");
            }
        })
            .catch((error) => {
            throw new _1.ServiceError("Error in getDatasetEntityByConditions", error);
        });
    }
    getOneDatasetByUserIdAndConditions(userId, conditions) {
        return this.getOneDatasetEntityByUserIdAndConditions(userId, conditions).then((de) => {
            return jsmoney_server_api_1.DatasetObject.make(de);
        });
    }
    getOneDatasetEntityByConditions(conditions) {
        return this.connection
            .getRepository(entities_1.DatasetEntity)
            .findOne(conditions)
            .catch((error) => {
            throw new _1.ServiceError("Error in getDatasetEntityByConditions", error);
        });
    }
    getOneDatasetByConditions(conditions) {
        return this.getOneDatasetEntityByConditions(conditions).then((de) => {
            return jsmoney_server_api_1.DatasetObject.make(de);
        });
    }
};
__decorate([
    typedi_1.Inject((_typ) => _1.UserServiceComponent),
    __metadata("design:type", _1.UserServiceComponent)
], AccountServiceComponent.prototype, "userService", void 0);
AccountServiceComponent = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], AccountServiceComponent);
exports.AccountServiceComponent = AccountServiceComponent;
