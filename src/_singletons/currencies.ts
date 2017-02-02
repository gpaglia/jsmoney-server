import * as logger from 'winston';

import { Container, Service } from 'typedi';
import { EntityManager } from "typeorm";
import { OrmEntityManager } from "typeorm-typedi-extensions";

import { getConfigData } from '../_singletons/config';
import { CurrencyEntity } from '../entities/currency.entity.model'
import { CurrencyDTO } from '../dto/currency.dto';

@Service()
export class Currencies {
  private map: Map<string, CurrencyDTO>;

  constructor(@OrmEntityManager(getConfigData().database.name) private entityManager: EntityManager) {
    this.map = new Map<string, CurrencyDTO>();
    this.loadCurrencies();
  }

  public getCurrency(code: string): CurrencyDTO {
    return this.map.get(code);
  }

  public getCurrencies(): CurrencyDTO[] {
    return Array.from(this.map.values());
  }

  private loadCurrencies(): void {
    this.entityManager
    .find<CurrencyEntity>(CurrencyEntity)
    .then((entities: CurrencyEntity[]) => {
      logger.debug('[SERVER] loadCurrencies found ' + entities.length + ' items');
      for (let ce of entities) {
        let cdto: CurrencyDTO = new CurrencyDTO(ce.code, ce.iso, ce.description, ce.scale);
        this.map.set(cdto.code, cdto);
      }
      logger.debug('[SERVER] Currencies singleton loaded ' + this.map.size);
    })
    .catch(err => {
      logger.error('[SERVER] Error in currency loading ' + err);
    });
  }

}
