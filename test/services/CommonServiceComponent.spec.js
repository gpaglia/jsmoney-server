/**
 * Mocha spec for CommonServiceComponent
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-function-expression only-arrow-functions typedef
const chai_1 = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai_1.use(chaiAsPromised);
chai_1.should();
const setupUtils_1 = require("../test-fixtures/setupUtils");
const loadCurrencyData_1 = require("../_initializers/loadCurrencyData");
const loadUserData_1 = require("../_initializers/loadUserData");
const jsmoney_server_api_1 = require("jsmoney-server-api");
const typedi_1 = require("typedi");
const Config_1 = require("../_singletons/Config");
const services_1 = require("../services");
const N_CURRENCIES = 149;
const N_USERS = 2;
describe("Common Service Tests", () => {
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
    describe("TestCurrency services", function () {
        it("background tests", function () {
            chai_1.expect(process.env.NODE_ENV, "Env should be 'test'").to.equal("test");
            chai_1.expect(Config_1.Config.getConfigData(), "Config data not null").not.to.be.empty;
        });
    });
    describe("Load currencies", () => {
        it("expect to load >0 currencies", function () {
            return loadCurrencyData_1.loadCurrencyData().should.eventually.equal(N_CURRENCIES, "Load N_CURRENCIES");
        });
    });
    describe("load default users", function () {
        it("expect to load >=2 users", function () {
            return loadUserData_1.loadUserData().should.eventually.have.length.at.least(N_USERS);
        });
    });
    describe("Service tests", function () {
        beforeEach(function () {
            return loadCurrencyData_1.loadCurrencyData();
        });
        describe("getAllCurrencies()", function () {
            it("expect to have key currencies", function () {
                const svc = typedi_1.Container.get(services_1.CommonServiceComponent);
                return svc.getAllCurrencies().then((cc) => { return cc.map((c) => c.code); })
                    .should.eventually.include.members(["EUR", "USD", "JPY", "CAD"])
                    .and.have.lengthOf(N_CURRENCIES);
            });
        });
        describe("getAllCurrenciesCount()", function () {
            it("expect to return N", function (done) {
                const svc = typedi_1.Container.get(services_1.CommonServiceComponent);
                svc.getAllCurrenciesCount()
                    .then((n) => {
                    chai_1.expect(n).to.exist;
                    chai_1.expect(n).to.equal(N_CURRENCIES);
                    done();
                })
                    .catch((error) => {
                    done(error);
                });
            });
        });
        describe("getAllMajorCurrencyCodes()", function () {
            it("expect to return EUR, USD, GBP, JPY", function () {
                const svc = typedi_1.Container.get(services_1.CommonServiceComponent);
                return svc.getAllMajorCurrencyCodes().should.eventually.include.members(["EUR", "USD", "GBP", "JPY"]);
            });
        });
        describe("getOneCurrencyByCode()", function () {
            it("expect to return currency for USD", function (done) {
                const svc = typedi_1.Container.get(services_1.CommonServiceComponent);
                svc.getOneCurrencyByCode("USD")
                    .then((co) => {
                    chai_1.expect(co).to.be.instanceof(jsmoney_server_api_1.CurrencyObject);
                    chai_1.expect(co).to.exist;
                    chai_1.expect(co.scale).to.equal(2);
                    chai_1.expect(co.iso).to.equal("840");
                    done();
                })
                    .catch((error) => {
                    done(error);
                });
            });
        });
        describe("getMultipleCurrenciesByCode()", function () {
            it("expect to return currency for USD, EUR", function (done) {
                const svc = typedi_1.Container.get(services_1.CommonServiceComponent);
                svc.getMultipleCurrenciesByCode(["EUR", "USD"])
                    .then((cos) => {
                    chai_1.expect(cos).to.be.instanceof(Array);
                    chai_1.expect(cos.length).to.equal(2);
                    chai_1.expect(cos.map((co) => co.code)).to.include("EUR");
                    chai_1.expect(cos.map((co) => co.code)).to.include("USD");
                    done();
                })
                    .catch((error) => {
                    done(error);
                });
            });
        });
    });
});
