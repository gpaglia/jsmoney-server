import * as logger from 'winston';
import { Container } from 'typedi';
import { EntityManager, ConnectionManager } from 'typeorm';
import { Validator, ValidationError } from 'class-validator';

import { getEntityManager } from '../_singletons/config';

import { CurrencyEntity } from '../entities/currency.entity.model';
import { CurrencyDTO } from '../dto/currency.dto';

const countries: any[] = require('../_data/currency.country.data.json');

function defaultCurrencies(): Map<string, CurrencyDTO>  {
  let validator: Validator = Container.get<Validator>(Validator);
  let currencies: Map<string, CurrencyDTO> = new Map<string, CurrencyDTO>();
  countries.forEach(cd => {
    let cdto = new CurrencyDTO(cd.currency_alphabetic_code, cd.currency_numeric_code, cd.currency_name, cd.currency_minor_unit);
    let errors: ValidationError[] = validator.validateSync(cdto);
    if (!errors || errors.length === 0) {
      currencies.set(cdto.code, cdto);
    } else {
      logger.info('[SERVER] Currency not imported, ' + JSON.stringify(cdto, null, 4));
    }
  });
  return currencies;
}

export function loadCurrencyData(): Promise<void> {
  let cm: ConnectionManager = Container.get<ConnectionManager>(ConnectionManager);

  let entityManager: EntityManager = getEntityManager();

  return entityManager
  .findAndCount<CurrencyEntity>(CurrencyEntity)
  .then((value: [CurrencyEntity[], number]) => {
    let cnt = value[1];
    if (cnt === 0) {
      let nloaded = 0;
      for (const c of defaultCurrencies().values()) {
        let newC: CurrencyEntity = new CurrencyEntity(
          c.code,
          c.iso,
          c.description,
          c.scale
        );
        entityManager.persist(newC);
        nloaded++;
      }
      logger.info('[SERVER] Initialized currency data with ' + nloaded + ' currencies');
    } else {
      logger.info('[SERVER] Currencies already in db, not loaded');
    }
  })
  .catch(err => {
    logger.error('[SERVER] Error in currency loading ' + err);

  });
}
