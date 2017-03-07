/**
 * Mocha spec for CommonServiceComponent
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

import {
    clearTestDb,
    closeTestDb,
    init
} from "../test-fixtures/setupUtils";

import { loadCurrencyData } from "../_initializers/loadCurrencyData";
import { loadUserData } from "../_initializers/loadUserData";

import {
    CurrencyObject
} from "jsmoney-server-api";

import { Container } from "typedi";

import { Config } from "../_singletons/Config";

import { CommonServiceComponent } from "../services";

const N_CURRENCIES = 149;
const N_USERS = 2;

describe("Common Service Tests", () => {
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

    describe("TestCurrency services", function () {
        it("background tests", function () {
            expect(process.env.NODE_ENV, "Env should be 'test'").to.equal("test");
            expect(Config.getConfigData(), "Config data not null").not.to.be.empty;
        });
    });

    describe("Load currencies", () => {
        it("expect to load >0 currencies", function () {
            return loadCurrencyData().should.eventually.equal(N_CURRENCIES, "Load N_CURRENCIES");
        });
    });

    describe("load default users", function () {
        it("expect to load >=2 users", function () {
            return loadUserData().should.eventually.have.length.at.least(N_USERS);
        });
    });

    describe("Service tests", function () {

        beforeEach(function() {
            return loadCurrencyData();
        });

        describe("getAllCurrencies()", function () {
            it("expect to have key currencies", function () {
                const svc: CommonServiceComponent = Container.get<CommonServiceComponent>(CommonServiceComponent);
                return svc.getAllCurrencies().then((cc) => { return cc.map((c) => c.code); })
                    .should.eventually.include.members(["EUR", "USD", "JPY", "CAD"])
                    .and.have.lengthOf(N_CURRENCIES);
            });
        });

        describe("getAllCurrenciesCount()", function () {
            it("expect to return N", function (done: MochaDone) {
                const svc: CommonServiceComponent = Container.get<CommonServiceComponent>(CommonServiceComponent);
                svc.getAllCurrenciesCount()
                    .then((n: number) => {
                        expect(n).to.exist;
                        expect(n).to.equal(N_CURRENCIES);
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
        });

        describe("getAllMajorCurrencyCodes()", function () {
            it("expect to return EUR, USD, GBP, JPY", function () {
                const svc: CommonServiceComponent = Container.get<CommonServiceComponent>(CommonServiceComponent);
                return svc.getAllMajorCurrencyCodes().should.eventually.include.members(["EUR", "USD", "GBP", "JPY"]);
            });
        });

        describe("getOneCurrencyByCode()", function () {
            it("expect to return currency for USD", function (done: MochaDone) {
                const svc: CommonServiceComponent = Container.get<CommonServiceComponent>(CommonServiceComponent);
                svc.getOneCurrencyByCode("USD")
                    .then((co) => {
                        expect(co).to.be.instanceof(CurrencyObject);
                        expect(co).to.exist;
                        expect(co.scale).to.equal(2);
                        expect(co.iso).to.equal("840");
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
        });

        describe("getMultipleCurrenciesByCode()", function () {
            it("expect to return currency for USD, EUR", function (done: MochaDone) {
                const svc: CommonServiceComponent = Container.get<CommonServiceComponent>(CommonServiceComponent);
                svc.getMultipleCurrenciesByCode(["EUR", "USD"])
                    .then((cos) => {
                        expect(cos).to.be.instanceof(Array);
                        expect(cos.length).to.equal(2);
                        expect(cos.map((co) => co.code)).to.include("EUR");
                        expect(cos.map((co) => co.code)).to.include("USD");
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
        });
    });

});
