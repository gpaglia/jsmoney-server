/**
 * Mocha spec for UserServiceComponent
 */

// tslint:disable:no-function-expression only-arrow-functions typedef

import {
    expect,
    should as chaiShould,
    use as chaiUse
} from "chai";

import * as chaiAsPromised from "chai-as-promised";

chaiUse(chaiAsPromised);
chaiShould();

import * as uuid from "uuid";

import {
    clearTestDb,
    closeTestDb,
    init
} from "../test-fixtures/setupUtils";

import { loadUserData } from "../_initializers/loadUserData";

import {
    CredentialsObject,
    Role,
    UserAndPasswordObject,
    UserObject
} from "jsmoney-server-api";

import { UserEntity } from "../entities";

import { Container } from "typedi";

import {
    UserServiceComponent,
    ValidationStatus
} from "../services";

describe("User Service Tests", () => {
    before(function (done) {
        console.log("Outer before");
        init()
            .then(() => {
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    after(function (done) {
        console.log("Outer after");
        closeTestDb()
            .then(() => {
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    beforeEach(function (done) {
        console.log("Outer before each");
        init()
            .then(() => {
                console.log("AAA");
                return clearTestDb();
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
        const svc: UserServiceComponent = Container.get<UserServiceComponent>(UserServiceComponent);

        beforeEach(function () {
            return loadUserData();
        });

        describe("validateUserByCredentials()", function () {

            it("expect to validate admin/Password", function (done) {

                svc.validateUserByCredentials(new CredentialsObject("admin", "Password"))
                    .then((vi) => {
                        expect(vi).to.have.property("status", ValidationStatus.Validated);
                        expect(vi).to.have.deep.property("user.username", "admin");
                        expect(vi).to.have.deep.property("user.role", Role.administrator);
                        expect(vi).to.have.deep.property("user.id").that.is.a("string");
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });

            });

            it("expect to validate user/Password", function (done) {
                svc.validateUserByCredentials(new CredentialsObject("user", "Password"))
                    .then((vi) => {
                        expect(vi).to.have.property("status", ValidationStatus.Validated);
                        expect(vi).to.have.deep.property("user.username", "user");
                        expect(vi).to.have.deep.property("user.role", Role.user);
                        expect(vi).to.have.deep.property("user.id").that.is.a("string");
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });

            });

            it("expect to validate pwd too short", function () {
                return svc.validateUserByCredentials(new CredentialsObject("user", "xyz"))
                    .should.eventually.have.property("status", ValidationStatus.InvalidData);
            });

            it("expect to validate username too short", function () {
                return svc.validateUserByCredentials(new CredentialsObject("xyz", "abc"))
                    .should.eventually.have.property("status", ValidationStatus.InvalidData);
            });

            it("expect to validate wrong pwd", function () {
                return svc.validateUserByCredentials(new CredentialsObject("user", "1234567890"))
                    .should.eventually.have.property("status", ValidationStatus.WrongPassword);
            });

            it("expect to validate no user", function () {
                return svc.validateUserByCredentials(new CredentialsObject("userxxx", "Password"))
                    .should.eventually.have.property("status", ValidationStatus.NoUser);
            });
        });


        describe("getOneUserEntityByConditions()", function () {

            it("expect one UserEntity 1", function (done) {
                svc.getOneUserEntityByConditions({ username: "user" })
                    .then(((ue) => {
                        expect(ue).to.exist;
                        expect(ue).to.be.instanceof(UserEntity);
                        expect(ue.username).to.equal("user");
                        done();
                    }))
                    .catch((error) => {
                        done(error);
                    });
            });

            it("expect one UserEntity 2", function (done) {
                svc.getOneUserEntityByConditions({ email: "user@domain.com" })
                    .then(((ue) => {
                        expect(ue).to.exist;
                        expect(ue).to.be.instanceof(UserEntity);
                        expect(ue.username).to.equal("user");
                        done();
                    }))
                    .catch((error) => {
                        done(error);
                    });
            });

            it("expect one UserEntity 3", function (done) {
                svc.getOneUserEntityByConditions({ username: "pippo" })
                    .then(((ue) => {
                        expect(ue).to.not.exist;
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
                        expect(uo).to.exist;
                        expect(uo).to.be.instanceof(UserObject);
                        expect(uo.username).to.equal("user");
                        done();
                    }))
                    .catch((error) => {
                        done(error);
                    });
            });

            it("expect one UserObject 2", function (done) {
                svc.getOneUserByConditions({ email: "user@domain.com" })
                    .then(((uo) => {
                        expect(uo).to.exist;
                        expect(uo).to.be.instanceof(UserObject);
                        expect(uo.username).to.equal("user");
                        done();
                    }))
                    .catch((error) => {
                        done(error);
                    });
            });

            it("expect one UserObject 3", function (done) {
                svc.getOneUserByConditions({ username: "pippo" })
                    .then(((uo) => {
                        expect(uo).to.not.exist;
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
                        expect(uo).to.exist;
                        expect(uo).to.be.instanceof(UserObject);
                        expect(uo.username).to.equal("user");
                        done();
                    }))
                    .catch((error) => {
                        done(error);
                    });
            });
        });

        describe("createOneUser()", function () {

            it("expect one UserObject created", function (done) {
                const upo: UserAndPasswordObject = UserAndPasswordObject.make({
                    user: {
                        id: uuid.v4(),
                        version: 0,
                        username: "auser",
                        firstName: "afn",
                        lastName: "aln",
                        email: "a.user@domain.com",
                        role: Role.user
                    },
                    password: "apassword"
                });
                // tslint:disable-next-line:chai-vague-errors
                expect(upo.isValid(), "UserAndPasswordObject not valid").to.be.true;
                svc.createOneUser(upo)
                    .then(((uo) => {
                        expect(uo).to.exist;
                        expect(uo).to.be.instanceof(UserObject);
                        expect(uo.username).to.equal("auser");
                        done();
                    }))
                    .catch((error) => {
                        done(error);
                    });

            });
        });
    });
});
