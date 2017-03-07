/**
 * Mocha spec for AccountServiceComponent
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
const loadCurrencyData_1 = require("../_initializers/loadCurrencyData");
const loadUserData_1 = require("../_initializers/loadUserData");
const jsmoney_server_api_1 = require("jsmoney-server-api");
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
            console.log("Clearing DB");
            return setupUtils_1.clearTestDb();
        })
            .then(() => {
            console.log("Loading currencies");
            return loadCurrencyData_1.loadCurrencyData();
        })
            .then(() => {
            console.log("Loading default users");
            return loadUserData_1.loadUserData();
        })
            .then(() => {
            done();
        })
            .catch((error) => {
            done(error);
        });
    });
    // tests here
    describe("create dataset", function () {
        const usvc = typedi_1.Container.get(services_1.UserServiceComponent);
        const dsvc = typedi_1.Container.get(services_1.AccountServiceComponent);
        let userId;
        it("create dataset for user", function (done) {
            userId = null;
            usvc.getOneUserByUsername("user")
                .then((uo) => {
                if (uo == null) {
                    done("No user returned for username=user");
                }
                userId = uo.id;
                const dso = new jsmoney_server_api_1.DatasetObject(uuid.v4(), 0, uo.id, "TestDS", "Description", "EUR", []);
                return dsvc.createOneDataset(dso);
            })
                .then((dso) => {
                console.log("*** Returned DSO ", dso);
                chai_1.expect(dso).to.exist;
                chai_1.expect(dso).to.have.property("id").to.be.a("string");
                chai_1.expect(dso).to.have.property("version").to.be.gt(0);
                chai_1.expect(dso).to.have.property("userId").to.equal(userId);
                chai_1.expect(dso).to.have.property("name").to.equal("TestDS");
                chai_1.expect(dso).to.have.property("description").to.equal("Description");
                chai_1.expect(dso).to.have.property("currencyCode").to.equal("EUR");
                chai_1.expect(dso).to.have.property("additionalCurrencyCodes").to.be.instanceof(Array);
                chai_1.expect(dso).to.have.property("additionalCurrencyCodes").to.have.lengthOf(0);
                done();
            })
                .catch((error) => {
                done(error);
            });
        });
    });
});
