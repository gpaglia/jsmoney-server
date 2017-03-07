/**
 * Mocha spec for UserServiceComponent
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-function-expression only-arrow-functions typedef
const chai_1 = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai_1.use(chaiAsPromised);
chai_1.should();
const uuid = require("uuid");
const setupUtils_1 = require("../test-fixtures/setupUtils");
const loadUserData_1 = require("../_initializers/loadUserData");
const jsmoney_server_api_1 = require("jsmoney-server-api");
const entities_1 = require("../entities");
const typedi_1 = require("typedi");
const services_1 = require("../services");
describe("User Service Tests", () => {
    before(function (done) {
        console.log("Outer before");
        setupUtils_1.init()
            .then(() => {
            done();
        })
            .catch((error) => {
            done(error);
        });
    });
    after(function (done) {
        console.log("Outer after");
        setupUtils_1.closeTestDb()
            .then(() => {
            done();
        })
            .catch((error) => {
            done(error);
        });
    });
    beforeEach(function (done) {
        console.log("Outer before each");
        setupUtils_1.init()
            .then(() => {
            console.log("AAA");
            return setupUtils_1.clearTestDb();
        })
            .then(() => {
            console.log("BBB");
            done();
        })
            .catch((error) => {
            done(error);
        });
    });
    describe("Service tests", () => {
        const svc = typedi_1.Container.get(services_1.UserServiceComponent);
        beforeEach(function () {
            return loadUserData_1.loadUserData();
        });
        describe("validateUserByCredentials()", function () {
            it("expect to validate admin/Password", function (done) {
                svc.validateUserByCredentials(new jsmoney_server_api_1.CredentialsObject("admin", "Password"))
                    .then((vi) => {
                    chai_1.expect(vi).to.have.property("status", services_1.ValidationStatus.Validated);
                    chai_1.expect(vi).to.have.deep.property("user.username", "admin");
                    chai_1.expect(vi).to.have.deep.property("user.role", jsmoney_server_api_1.Role.administrator);
                    chai_1.expect(vi).to.have.deep.property("user.id").that.is.a("string");
                    done();
                })
                    .catch((error) => {
                    done(error);
                });
            });
            it("expect to validate user/Password", function (done) {
                svc.validateUserByCredentials(new jsmoney_server_api_1.CredentialsObject("user", "Password"))
                    .then((vi) => {
                    chai_1.expect(vi).to.have.property("status", services_1.ValidationStatus.Validated);
                    chai_1.expect(vi).to.have.deep.property("user.username", "user");
                    chai_1.expect(vi).to.have.deep.property("user.role", jsmoney_server_api_1.Role.user);
                    chai_1.expect(vi).to.have.deep.property("user.id").that.is.a("string");
                    done();
                })
                    .catch((error) => {
                    done(error);
                });
            });
            it("expect to validate pwd too short", function () {
                return svc.validateUserByCredentials(new jsmoney_server_api_1.CredentialsObject("user", "xyz"))
                    .should.eventually.have.property("status", services_1.ValidationStatus.InvalidData);
            });
            it("expect to validate username too short", function () {
                return svc.validateUserByCredentials(new jsmoney_server_api_1.CredentialsObject("xyz", "abc"))
                    .should.eventually.have.property("status", services_1.ValidationStatus.InvalidData);
            });
            it("expect to validate wrong pwd", function () {
                return svc.validateUserByCredentials(new jsmoney_server_api_1.CredentialsObject("user", "1234567890"))
                    .should.eventually.have.property("status", services_1.ValidationStatus.WrongPassword);
            });
            it("expect to validate no user", function () {
                return svc.validateUserByCredentials(new jsmoney_server_api_1.CredentialsObject("userxxx", "Password"))
                    .should.eventually.have.property("status", services_1.ValidationStatus.NoUser);
            });
        });
        describe("getOneUserEntityByConditions()", function () {
            it("expect one UserEntity 1", function (done) {
                svc.getOneUserEntityByConditions({ username: "user" })
                    .then(((ue) => {
                    chai_1.expect(ue).to.exist;
                    chai_1.expect(ue).to.be.instanceof(entities_1.UserEntity);
                    chai_1.expect(ue.username).to.equal("user");
                    done();
                }))
                    .catch((error) => {
                    done(error);
                });
            });
            it("expect one UserEntity 2", function (done) {
                svc.getOneUserEntityByConditions({ email: "user@domain.com" })
                    .then(((ue) => {
                    chai_1.expect(ue).to.exist;
                    chai_1.expect(ue).to.be.instanceof(entities_1.UserEntity);
                    chai_1.expect(ue.username).to.equal("user");
                    done();
                }))
                    .catch((error) => {
                    done(error);
                });
            });
            it("expect one UserEntity 3", function (done) {
                svc.getOneUserEntityByConditions({ username: "pippo" })
                    .then(((ue) => {
                    chai_1.expect(ue).to.not.exist;
                    done();
                }))
                    .catch((error) => {
                    done(error);
                });
            });
        });
        describe("getOneUserByConditions()", function () {
            it("expect one UserObject 1", function (done) {
                svc.getOneUserByConditions({ username: "user" })
                    .then(((uo) => {
                    chai_1.expect(uo).to.exist;
                    chai_1.expect(uo).to.be.instanceof(jsmoney_server_api_1.UserObject);
                    chai_1.expect(uo.username).to.equal("user");
                    done();
                }))
                    .catch((error) => {
                    done(error);
                });
            });
            it("expect one UserObject 2", function (done) {
                svc.getOneUserByConditions({ email: "user@domain.com" })
                    .then(((uo) => {
                    chai_1.expect(uo).to.exist;
                    chai_1.expect(uo).to.be.instanceof(jsmoney_server_api_1.UserObject);
                    chai_1.expect(uo.username).to.equal("user");
                    done();
                }))
                    .catch((error) => {
                    done(error);
                });
            });
            it("expect one UserObject 3", function (done) {
                svc.getOneUserByConditions({ username: "pippo" })
                    .then(((uo) => {
                    chai_1.expect(uo).to.not.exist;
                    done();
                }))
                    .catch((error) => {
                    done(error);
                });
            });
        });
        describe("getOneUserByUsername()", function () {
            it("expect one UserObject", function (done) {
                svc.getOneUserByUsername("user")
                    .then(((uo) => {
                    chai_1.expect(uo).to.exist;
                    chai_1.expect(uo).to.be.instanceof(jsmoney_server_api_1.UserObject);
                    chai_1.expect(uo.username).to.equal("user");
                    done();
                }))
                    .catch((error) => {
                    done(error);
                });
            });
        });
        describe("createOneUser()", function () {
            it("expect one UserObject created", function (done) {
                const upo = jsmoney_server_api_1.UserAndPasswordObject.make({
                    user: {
                        id: uuid.v4(),
                        version: 0,
                        username: "auser",
                        firstName: "afn",
                        lastName: "aln",
                        email: "a.user@domain.com",
                        role: jsmoney_server_api_1.Role.user
                    },
                    password: "apassword"
                });
                // tslint:disable-next-line:chai-vague-errors
                chai_1.expect(upo.isValid(), "UserAndPasswordObject not valid").to.be.true;
                svc.createOneUser(upo)
                    .then(((uo) => {
                    chai_1.expect(uo).to.exist;
                    chai_1.expect(uo).to.be.instanceof(jsmoney_server_api_1.UserObject);
                    chai_1.expect(uo.username).to.equal("auser");
                    done();
                }))
                    .catch((error) => {
                    done(error);
                });
            });
        });
    });
});
