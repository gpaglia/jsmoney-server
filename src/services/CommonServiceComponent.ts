/**
 * CommonServiceComponent class
 */
// import * as logger from "winston";

import {
  Inject,
  Service
} from "typedi";

import {
  AbstractServiceComponent
} from ".";

import { CurrencyObject } from "jsmoney-server-api";
import { Currencies } from "../_singletons/Currencies";

const MAJOR_CURRENCIES: string[] = [
  "EUR",
  "USD",
  "GBP",
  "JPY",
  "CAN"
];

@Service()
export class CommonServiceComponent extends AbstractServiceComponent {
  @Inject()
  private currencies: Currencies;

  constructor() {
    super();
  }

  public getAllCurrencies(majorOrCodes?: boolean|string[]): Promise<CurrencyObject[]> {
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
    const curdata = this.currencies
      .getCurrencies()
      .filter((cdto) => {
        if (major) {
          return (MAJOR_CURRENCIES.indexOf(cdto.code) >= 0);
        } else {
          return ((codes == null) || (codes.indexOf(cdto.code) >= 0));
        }
      });
    return Promise.resolve(curdata);
  }

  public getAllMajorCurrencyCodes(): Promise<String[]> {
    return Promise.resolve(MAJOR_CURRENCIES);
  }

  public getOneCurrencyByCode(code: string): Promise<CurrencyObject> {
    return Promise.resolve(
      this.currencies.getCurrency(code)
    );
  }

  public getMultipleCurrenciesByCode(codes: string[]): Promise<CurrencyObject[]> {
    return Promise.resolve(
      this.currencies.getCurrencies().filter((cdto) => {
        return (codes.indexOf(cdto.code) >= 0);
      })
    );
  }

}
