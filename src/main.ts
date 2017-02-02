import * as logger from 'winston';
// This is a global singleton
import 'reflect-metadata';
import { Container } from 'typedi';
import { useContainer as typeormUseContainer, ConnectionManager } from 'typeorm';
import { useContainer as validatorUseContainer, Validator } from 'class-validator';

import { MainServer } from './startup/main.server';

// Init container with typeorm and class-validator
typeormUseContainer(Container);
let connectionManager = Container.get<ConnectionManager>(ConnectionManager);
validatorUseContainer(Container);
let validator = Container.get(Validator);


logger.configure({
  level: 'debug',
  transports: [
    new logger.transports.Console()
  ]
});

let server = Container.get<MainServer>(MainServer);
server.run();
