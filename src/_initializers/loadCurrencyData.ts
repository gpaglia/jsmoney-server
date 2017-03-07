/**
 * Currency Data initializer
 */
import * as logger from "winston";

import { Container } from "typedi";

import { CurrencyObject } from "jsmoney-server-api";

import { CommonServiceComponent } from "../services";

// tslint:disable-next-line:no-any no-var-requires no-require-imports
// const countries: any[] = require("../_data/currency.country.data.js");
import { countryData } from "../_data/countryData";

function defaultCurrencies(): CurrencyObject[] {
  const map: {
    [key: string]: boolean
  } = {};
  const out: CurrencyObject[] = [];

  // get unique values
  countryData.forEach((cd) => {
    const co = new CurrencyObject(cd.currency_alphabetic_code, cd.currency_numeric_code, cd.currency_name, Number.parseInt(cd.currency_minor_unit));
    if (co.isValid() && !map[co.code]) {
      out.push(co);
      map[co.code] = true;
    }
  });

  return out;
}

export function loadCurrencyData(): Promise<number> {
  // const cm: ConnectionManager = Container.get<ConnectionManager>(ConnectionManager);
  const svc: CommonServiceComponent = Container.get<CommonServiceComponent>(CommonServiceComponent);

  return svc.getAllCurrenciesCount()
    .then((cnt) => {
      if (cnt == null) {
        console.log ("[SERVER] getAllCurrenciesCount() returned undefined in loadCurrencyData");
        throw ("[SERVER] getAllCurrenciesCount() returned undefined in loadCurrencyData");
      } else if (cnt === 0) {
        return svc.createMultipleCurrencies(defaultCurrencies())
          .then((objs) => {
            logger.info("[SERVER] Initialized currency data with " + objs.length + " currencies");
            return objs.length;
          });
      } else {
        logger.info("[SERVER] Currencies already in db, not loaded");
        return 0;
      }
    })
    .catch((err) => {
      logger.error("[SERVER] Error in currency loading " + err);
      throw ("[SERVER] Error in currency loading ");
    });
}
