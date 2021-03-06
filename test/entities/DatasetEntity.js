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
 * DatasetEntity class
 */
const typeorm_1 = require("typeorm");
const _1 = require(".");
const jsmoney_server_api_1 = require("jsmoney-server-api");
let DatasetEntity = class DatasetEntity extends _1.BaseEntity {
    constructor(obj, user) {
        super(obj);
        if (obj && user) {
            this.user = user;
            this.name = obj.name;
            this.description = obj.description;
            this.currencyCode = obj.currencyCode;
            this.additionalCurrencyCodes = obj.additionalCurrencyCodes;
        }
    }
    get userId() {
        return this.user != null ? this.user.id : undefined;
    }
    isValid() {
        return jsmoney_server_api_1.isDatasetObject(this);
    }
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DatasetEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DatasetEntity.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DatasetEntity.prototype, "currencyCode", void 0);
__decorate([
    typeorm_1.Column("simple_array"),
    __metadata("design:type", Array)
], DatasetEntity.prototype, "additionalCurrencyCodes", void 0);
__decorate([
    typeorm_1.ManyToOne(() => _1.UserEntity),
    __metadata("design:type", _1.UserEntity)
], DatasetEntity.prototype, "user", void 0);
DatasetEntity = __decorate([
    typeorm_1.Table(),
    __metadata("design:paramtypes", [jsmoney_server_api_1.DatasetObject, _1.UserEntity])
], DatasetEntity);
exports.DatasetEntity = DatasetEntity;
