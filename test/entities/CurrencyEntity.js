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
 * CurrencyEntity class
 */
const typeorm_1 = require("typeorm");
let CurrencyEntity = class CurrencyEntity {
    constructor(codeOrObj, iso, description, scale) {
        if (arguments.length === 1) {
            this.code = codeOrObj.code;
            this.iso = codeOrObj.iso;
            this.description = codeOrObj.description;
            this.scale = codeOrObj.scale;
        }
        else if (arguments.length === 4) {
            this.code = codeOrObj;
            this.iso = iso;
            this.description = description;
            this.scale = scale;
        }
    }
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], CurrencyEntity.prototype, "code", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], CurrencyEntity.prototype, "iso", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CurrencyEntity.prototype, "description", void 0);
__decorate([
    typeorm_1.Column("int"),
    __metadata("design:type", Number)
], CurrencyEntity.prototype, "scale", void 0);
CurrencyEntity = __decorate([
    typeorm_1.Table(),
    __metadata("design:paramtypes", [Object, String, String, Number])
], CurrencyEntity);
exports.CurrencyEntity = CurrencyEntity;
