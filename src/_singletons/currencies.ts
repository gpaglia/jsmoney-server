/**
 * Currencies singleton
 */
import * as logger from "winston";

import { Service } from "typedi";
import { EntityManager } from "typeorm";

import { Config } from "../_singletons/Config";

import { CurrencyEntity } from "../entities";

import { CurrencyObject } from "jsmoney-server-api";

@Service()
export class Currencies {
  private map: Map<string, CurrencyObject>;
  private entityManager: EntityManager;

  constructor() {
    this.entityManager = Config.getEntityManager();
    this.map = new Map<string, CurrencyObject>();
    this.loadCurrencies();
  }

  public getCurrency(code: string): CurrencyObject {
    return this.map.get(code);
  }

  public getCurrencies(): CurrencyObject[] {
    return Array.from(this.map.values());
  }

  private loadCurrencies(): void {
    this.entityManager
    .find<CurrencyEntity>(CurrencyEntity)
    .then((entities: CurrencyEntity[]) => {
      logger.debug("[SERVER] loadCurrencies found " + entities.length + " items");
      for (const ce of entities) {
        const cdto: CurrencyObject = new CurrencyObject(ce.code, ce.iso, ce.description, ce.scale);
        this.map.set(cdto.code, cdto);
      }
      logger.debug("[SERVER] Currencies singleton loaded " + this.map.size);
    })
    .catch((err) => {
      logger.error("[SERVER] Error in currency loading " + err);
    });
  }

}
