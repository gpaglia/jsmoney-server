/**
 * Currency Data initializer
 */
import * as logger from "winston";

import {
  EntityManager
} from "typeorm";

import { Config } from "../_singletons/Config";

import { CurrencyEntity } from "../entities";

import { CurrencyObject } from "jsmoney-server-api";

// tslint:disable-next-line:no-any no-var-requires no-require-imports
// const countries: any[] = require("../_data/currency.country.data.js");
import { countryData } from "../_data/countryData";

function defaultCurrencies(): Map<string, CurrencyObject>  {
  const currencies: Map<string, CurrencyObject> = new Map<string, CurrencyObject>();
  countryData.forEach((cd) => {
    const cdto = new CurrencyObject(cd.currency_alphabetic_code, cd.currency_numeric_code, cd.currency_name, Number.parseInt(cd.currency_minor_unit));
    if (cdto.isValid()) {
      currencies.set(cdto.code, cdto);
    } else {
      logger.info("[SERVER] Currency not imported, " + JSON.stringify(cdto, null, 4));
    }
  });
  return currencies;
}

export function loadCurrencyData(): Promise<void> {
  // const cm: ConnectionManager = Container.get<ConnectionManager>(ConnectionManager);

  const entityManager: EntityManager = Config.getEntityManager();

  return entityManager
  .findAndCount<CurrencyEntity>(CurrencyEntity)
  .then((value: [CurrencyEntity[], number]) => {
    const cnt = value[1];
    if (cnt === 0) {
      let nloaded = 0;
      for (const c of defaultCurrencies().values()) {
        const newC: CurrencyEntity = new CurrencyEntity(
          c.code,
          c.iso,
          c.description,
          c.scale
        );
        entityManager.persist(newC);
        nloaded = nloaded + 1;
      }
      logger.info("[SERVER] Initialized currency data with " + nloaded + " currencies");
    } else {
      logger.info("[SERVER] Currencies already in db, not loaded");
    }
  })
  .catch((err) => {
    logger.error("[SERVER] Error in currency loading " + err);

  });
}
