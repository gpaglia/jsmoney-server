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
 * UserEntity class
 */
const typeorm_1 = require("typeorm");
const _1 = require(".");
const jsmoney_server_api_1 = require("jsmoney-server-api");
let UserEntity = class UserEntity extends _1.BaseEntity {
    constructor(obj) {
        if (obj) {
            super(obj.user);
            this.password = obj.password;
            this.username = obj.user.username;
            this.firstName = obj.user.firstName;
            this.lastName = obj.user.lastName;
            this.email = obj.user.email;
            this.role = obj.user.role;
        }
        else {
            super();
        }
    }
};
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "username", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserEntity.prototype, "firstName", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserEntity.prototype, "lastName", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    typeorm_1.Column("int"),
    __metadata("design:type", Number)
], UserEntity.prototype, "role", void 0);
UserEntity = __decorate([
    typeorm_1.Table(),
    __metadata("design:paramtypes", [jsmoney_server_api_1.UserAndPasswordObject])
], UserEntity);
exports.UserEntity = UserEntity;
