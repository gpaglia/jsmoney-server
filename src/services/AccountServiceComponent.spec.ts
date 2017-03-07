/**
 * Mocha spec for AccountServiceComponent
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

import { loadCurrencyData } from "../_initializers/loadCurrencyData";
import { loadUserData } from "../_initializers/loadUserData";

import {
    DatasetObject,
    UserObject
} from "jsmoney-server-api";

import { DatasetEntity } from "../entities";

import { Container } from "typedi";

import {
    AccountServiceComponent,
    UserServiceComponent
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
                console.log("Clearing DB");
                return clearTestDb();
            })
            .then(() => {
                console.log("Loading currencies");
                return loadCurrencyData();
            })
            .then(() => {
                console.log("Loading default users");
                return loadUserData();
            })
            .then(() => {
                done();
            })
            .catch((error) => {
                done(error);
            });
    });
// tests here
    describe("create dataset", function() {
        const usvc: UserServiceComponent = Container.get<UserServiceComponent>(UserServiceComponent);
        const dsvc: AccountServiceComponent = Container.get<AccountServiceComponent>(AccountServiceComponent);
        let userId: string;

        it("create dataset for user", function(done) {
            userId = null;
            usvc.getOneUserByUsername("user")
                .then((uo) => {
                    if (uo == null) {
                        done("No user returned for username=user");
                    }
                    userId = uo.id;
                    const dso: DatasetObject = new DatasetObject(
                                                    uuid.v4(),
                                                    0,
                                                    uo.id,
                                                    "TestDS",
                                                    "Description",
                                                    "EUR",
                                                    []);
                    return dsvc.createOneDataset(dso);
                })
                .then((dso) => {
                    console.log("*** Returned DSO ", dso);
                    expect(dso).to.exist;
                    expect(dso).to.have.property("id").to.be.a("string");
                    expect(dso).to.have.property("version").to.be.gt(0);
                    expect(dso).to.have.property("userId").to.equal(userId);
                    expect(dso).to.have.property("name").to.equal("TestDS");
                    expect(dso).to.have.property("description").to.equal("Description");
                    expect(dso).to.have.property("currencyCode").to.equal("EUR");
                    expect(dso).to.have.property("additionalCurrencyCodes").to.be.instanceof(Array);
                    expect(dso).to.have.property("additionalCurrencyCodes").to.have.lengthOf(0);
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
    });
});