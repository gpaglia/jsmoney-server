/**
 * Server main module
 */

const rootDir = __dirname;

import * as logger from "winston";
// This is a global singleton

import "reflect-metadata";

import { Container } from "typedi";
Container.provide([{
  name: "ROOT_DIR",
  type: String,
  value: rootDir
}]);

// import { Config } from "./_singletons/Config";

import { useContainer as typeormUseContainer } from "typeorm";

// import { useContainer as validatorUseContainer } from "class-validator";

import { MainServer } from "./startup/MainServer";

// Init container with typeorm and class-validator
typeormUseContainer(Container);
// const connectionManager = Container.get<ConnectionManager>(ConnectionManager);
// validatorUseContainer(Container);
// const validator = Container.get(Validator);

logger.configure({
  level: "debug",
  transports: [
    new logger.transports.Console()
  ]
});

const server = Container.get<MainServer>(MainServer);
server.run();
