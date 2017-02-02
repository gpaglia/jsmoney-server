import * as logger from 'winston';

import { Service, Container, Inject } from 'typedi';
import { Connection, EntityManager } from 'typeorm';

import { AbstractServiceComponent } from './abstract.service.component';
import { ServiceError } from './service.error';

import { CurrencyDTO } from '../dto/currency.dto';
import { Currencies } from '../_singletons/currencies';

const MAJOR_CURRENCIES: Set<string> = new Set<string>([
  "EUR",
  "USD",
  "GBP",
  "JPY",
  "CAN"
]);

@Service()
export class CommonServiceComponent extends AbstractServiceComponent {
  @Inject()
  private currencies: Currencies;

  constructor() {
    super();
  }

  getAllCurrenciesDTO(): Promise<CurrencyDTO[]> {
    let curdata = this.currencies.getCurrencies();
    logger.debug('[SERVER] Returning currencies, size ' + curdata.length);
    return Promise.resolve(curdata);
  }

  getMajorCurrenciesDTO(): Promise<CurrencyDTO[]> {
    return Promise.resolve(
      this.currencies.getCurrencies()
            .filter(value => MAJOR_CURRENCIES.has(value.code))
      );
  }

}
