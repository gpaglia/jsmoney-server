/**
 * App Data Config
 */
import { loadCurrencyData } from "../_initializers/loadCurrencyData";
import { loadUserData } from "../_initializers/loadUserData";

export function appDataConfig(): Promise<void> {
  return Promise.resolve()
    .then(() => loadCurrencyData())
    .then(() => loadUserData())
    .then(() => {
      return null;
    });
}
