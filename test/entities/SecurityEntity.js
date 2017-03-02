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
 * SecurityEntity class
 */
const typeorm_1 = require("typeorm");
const _1 = require(".");
const jsmoney_server_api_1 = require("jsmoney-server-api");
let SecurityEntity = class SecurityEntity extends _1.CommodityEntity {
    constructor(obj) {
        super(obj);
        if (obj) {
            this.secType = obj.secType;
            this.altSymbol = obj.altSymbol;
        }
    }
};
__decorate([
    typeorm_1.Column("int"),
    __metadata("design:type", Number)
], SecurityEntity.prototype, "secType", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], SecurityEntity.prototype, "altSymbol", void 0);
SecurityEntity = __decorate([
    typeorm_1.Table(),
    __metadata("design:paramtypes", [jsmoney_server_api_1.SecurityObject])
], SecurityEntity);
exports.SecurityEntity = SecurityEntity;
