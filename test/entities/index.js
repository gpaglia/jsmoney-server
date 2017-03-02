"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Index import file
 */
const BaseEntity_1 = require("./BaseEntity");
exports.BaseEntity = BaseEntity_1.BaseEntity;
const CommodityEntity_1 = require("./CommodityEntity");
exports.CommodityEntity = CommodityEntity_1.CommodityEntity;
const CurrencyEntity_1 = require("./CurrencyEntity");
exports.CurrencyEntity = CurrencyEntity_1.CurrencyEntity;
const CurrencyRateEntity_1 = require("./CurrencyRateEntity");
exports.CurrencyRateEntity = CurrencyRateEntity_1.CurrencyRateEntity;
const DatasetEntity_1 = require("./DatasetEntity");
exports.DatasetEntity = DatasetEntity_1.DatasetEntity;
const SecurityEntity_1 = require("./SecurityEntity");
exports.SecurityEntity = SecurityEntity_1.SecurityEntity;
const UserEntity_1 = require("./UserEntity");
exports.UserEntity = UserEntity_1.UserEntity;
// tslint:disable-next-line:export-name
exports.ENTITIES = [
    BaseEntity_1.BaseEntity,
    CurrencyEntity_1.CurrencyEntity,
    UserEntity_1.UserEntity,
    DatasetEntity_1.DatasetEntity,
    CurrencyRateEntity_1.CurrencyRateEntity,
    SecurityEntity_1.SecurityEntity,
    CommodityEntity_1.CommodityEntity
];
