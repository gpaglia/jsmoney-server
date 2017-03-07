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
 * BaseEntity class
 */
const typeorm_1 = require("typeorm");
const jsmoney_server_api_1 = require("jsmoney-server-api");
let BaseEntity = class BaseEntity {
    constructor(obj) {
        if (obj) {
            this.id = obj.id;
            this.version = obj.version;
        }
    }
    // tslint:disable-next-line:no-any
    toJSON() {
        return this;
    }
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], BaseEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.VersionColumn(),
    __metadata("design:type", Number)
], BaseEntity.prototype, "version", void 0);
BaseEntity = __decorate([
    typeorm_1.AbstractTable(),
    __metadata("design:paramtypes", [jsmoney_server_api_1.DomainObject])
], BaseEntity);
exports.BaseEntity = BaseEntity;
