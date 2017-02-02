import { loadCurrencyData } from '../_initializers/load.currency.data';
import { loadUserData } from '../_initializers/load.user.data';

export function initialize(): Promise<void> {
  return Promise.resolve()
    .then(() => loadCurrencyData())
    .then(() => loadUserData())
    .then(any => {
      return null;
    });
}
