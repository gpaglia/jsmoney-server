/**
 * CommodityEntity class
 */
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
const typeorm_1 = require("typeorm");
const _1 = require(".");
const jsmoney_server_api_1 = require("jsmoney-server-api");
let CommodityEntity = class CommodityEntity extends _1.BaseEntity {
    constructor(obj) {
        super(obj);
        if (obj) {
            this.code = obj.code;
            this.comType = obj.comType;
            this.description = obj.description;
            this.currencyCode = obj.currencyCode;
            this.unit = obj.unit;
            this.scale = obj.scale;
            this.quoteDrivers = obj.quoteDrivers;
            this.lastPrice = obj.lastPrice.toString();
            this.lastPriceDate = obj.lastPriceDate;
            this.lastPriceInfo = obj.lastPriceInfo;
        }
    }
};
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], CommodityEntity.prototype, "code", void 0);
__decorate([
    typeorm_1.Column("int"),
    __metadata("design:type", Number)
], CommodityEntity.prototype, "comType", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CommodityEntity.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CommodityEntity.prototype, "currencyCode", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CommodityEntity.prototype, "unit", void 0);
__decorate([
    typeorm_1.Column("int"),
    __metadata("design:type", Number)
], CommodityEntity.prototype, "scale", void 0);
__decorate([
    typeorm_1.Column("simple_array"),
    __metadata("design:type", Array)
], CommodityEntity.prototype, "quoteDrivers", void 0);
__decorate([
    typeorm_1.Column("decimal"),
    __metadata("design:type", String)
], CommodityEntity.prototype, "lastPrice", void 0);
__decorate([
    typeorm_1.Column("date"),
    __metadata("design:type", Date)
], CommodityEntity.prototype, "lastPriceDate", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CommodityEntity.prototype, "lastPriceInfo", void 0);
CommodityEntity = __decorate([
    typeorm_1.AbstractTable(),
    __metadata("design:paramtypes", [jsmoney_server_api_1.CommodityObject])
], CommodityEntity);
exports.CommodityEntity = CommodityEntity;
