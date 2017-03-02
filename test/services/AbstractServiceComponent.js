/**
 * AbstractServiceComponent
 */
// import * as logging from "winston";
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
const Config_1 = require("../_singletons/Config");
let AbstractServiceComponent = class AbstractServiceComponent {
    constructor() {
        this.configData = Config_1.Config.getConfigData();
        this.connection = Config_1.Config.getConnection();
        this.entityManager = this.connection.entityManager;
    }
    createSelectionParam(alias, conditions) {
        let result = "";
        let first = true;
        Object.keys(conditions).forEach((key) => {
            let value;
            if (typeof conditions[key] === "string") {
                value = conditions[key];
            }
            else if (typeof conditions[key] === "number") {
                value = conditions[key].toString();
            }
            else if (typeof conditions[key] === "boolean") {
                value = conditions[key].toString();
            }
            else {
                value = JSON.stringify(conditions[key]);
            }
            result = result + (first ? "" : " and ") + alias + "." + key + "='" + value + "'";
            first = false;
        });
        return result;
    }
};
AbstractServiceComponent = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], AbstractServiceComponent);
exports.AbstractServiceComponent = AbstractServiceComponent;
