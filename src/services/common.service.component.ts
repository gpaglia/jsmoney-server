import * as logger from 'winston';

import { Service, Container, Inject } from 'typedi';
import { Connection, EntityManager } from 'typeorm';

import { AbstractServiceComponent } from './abstract.service.component';
import { ServiceError } from './service.error';

import { CurrencyDTO } from '../dto/currency.dto';
import { Currencies } from '../_singletons/currencies';

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

  getAllCurrenciesDTO(majorOrCodes?: boolean|string[]): Promise<CurrencyDTO[]> {
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
    let curdata = this.currencies
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

  getAllMajorCurrencyCodes(): Promise<String[]> {
    return Promise.resolve(MAJOR_CURRENCIES);
  }

  getCurrencyDTOByCode(code: string): Promise<CurrencyDTO> {
    return Promise.resolve(
      this.currencies.getCurrency(code)
    );
  }

  getAllCurrencyDTOByCode(codes: string[]): Promise<CurrencyDTO[]> {
    return Promise.resolve(
      this.currencies.getCurrencies().filter((cdto) => {
        codes.indexOf(cdto.code) >= 0;
      })
    );
  }

}
