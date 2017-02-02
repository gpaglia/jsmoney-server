import { Config } from '../_singletons/config';
import { Container } from 'typedi';

let config = Container.get<Config>(Config);

export function apiPath(path: string): string {
  return config.data().api.base + config.data().api.version + path;
}

export function errorInfo(info: string | {}): any {
  return {
    body: {
      info: info
    }
  };
}
