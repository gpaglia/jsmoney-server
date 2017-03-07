/**
 * CommonServiceComponent class
 */
import * as logger from "winston";

import {
  Service
} from "typedi";

import {
  AbstractServiceComponent
} from ".";

import { CurrencyObject } from "jsmoney-server-api";

import { CurrencyEntity } from "../entities";

import { ServiceError } from ".";

const MAJOR_CURRENCIES: string[] = [
  "EUR",
  "USD",
  "GBP",
  "JPY",
  "CAN"
];

type CacheEntry = [string, CurrencyObject];

@Service()
export class CommonServiceComponent extends AbstractServiceComponent {
  private currencyCache: Map<string, CurrencyObject> = null;

  constructor() {
    super();
  }

  public getAllCurrenciesCount(): Promise<number> {
    return this.getFromCacheOrLoad().then((map) => {
      console.log("************* MAP SIZE IN GET ", map.size);
      return map.size;
    });
  }

  public getAllCurrencies(majorOrCodes?: boolean | string[]): Promise<CurrencyObject[]> {
    let major: boolean;
    let codes: string[];
    if (arguments.length === 0) {
      major = false;
      codes = undefined;
    } else if (majorOrCodes instanceof Array) {
      codes = majorOrCodes as string[];
      major = false;
    } else {
      codes = undefined;
      major = majorOrCodes as boolean;
    }
    return this.getFromCacheOrLoad()
      .then((map) => {
        if (major) {
          return Array.from(map.values()).filter((c) => MAJOR_CURRENCIES.indexOf(c.code) >= 0);
        } else {
          return Array.from(map.values()).filter((c) => (codes == null) || (codes.indexOf(c.code) >= 0));
        }
      });
  }

  public getAllMajorCurrencyCodes(): Promise<String[]> {
    return Promise.resolve(MAJOR_CURRENCIES);
  }

  public getOneCurrencyByCode(code: string): Promise<CurrencyObject> {
    return this.getFromCacheOrLoad()
      .then((map) => { return map.get(code); });
  }

  public getMultipleCurrenciesByCode(codes: string[]): Promise<CurrencyObject[]> {
    return this.getAllCurrencies(codes);
  }

  public clearCurrencyCache(): void {
    this.currencyCache = null;
  }

  public createOneCurrency(cobj: CurrencyObject): Promise<CurrencyObject> {
    if (cobj.isValid()) {
      return this.entityManager.persist(new CurrencyEntity(cobj));
    } else {
      throw new ServiceError("Invalid CurrencyObject", cobj);
    }
  }

  public createMultipleCurrencies(cobjs: CurrencyObject[]): Promise<CurrencyObject[]> {
    return this.entityManager.persist(
      cobjs
        .filter((cobj) => cobj.isValid())
        .map((cobj) => new CurrencyEntity(cobj))
    );
  }

  private getFromCacheOrLoad(): Promise<Map<string, CurrencyObject>> {
    if (this.currencyCache == null || this.currencyCache.size === 0) {
      logger.debug("[SERVER] getFromCacheOrLoad() Cache miss!");
      return this.entityManager
        .find<CurrencyEntity>(CurrencyEntity)
        .then((carray: CurrencyEntity[]) => {
          if (carray.length > 0) {
            this.currencyCache = new Map<string, CurrencyObject>(carray.map((c) => {
              return [c.code, CurrencyObject.make(c)] as CacheEntry;
            }));
          } else {
            this.currencyCache = new Map<string, CurrencyObject>();
          }
          console.log("************** MAP SIZE", this.currencyCache.size);
          return this.currencyCache;
        })
        .catch((error) => {
          throw new ServiceError("Error in loading currency cache", error);
        });
    } else {
      logger.debug("[SERVER] getFromCacheOrLoad() Cache hit!");
      return Promise.resolve(this.currencyCache);
    }
  }

}
