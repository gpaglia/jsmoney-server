import * as express from 'express';
import * as path from 'path';
import * as logger from 'winston';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as cors from 'cors';

import * as appRoutes from './routes.config';
import * as appPassport from './passport.config';

import { Container, Inject, Service } from 'typedi';
import { Connection, EntityManager } from 'typeorm';

import { getConfigData } from '../_singletons/config';

export function startExpress(): Promise<void> {
  let configData = getConfigData();
  let app: express.Express = express();
  let router: express.Router = express.Router();

  Container.set('express', app);

  return Promise.resolve()
    .then(() => {

      logger.info('[SERVER] express in startServer is ' + JSON.stringify(app, null, 4));
      logger.info('[SERVER] router in startServer is ' + JSON.stringify(router, null, 4));

      app.use(morgan('common'));
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json({ type: '*/*' }));

      logger.info('[SERVER] Initializing passport');

      appPassport.configPassport();
      app.use(passport.initialize());

      logger.info('[SERVER] Initializing routes');

      app.use(express.static(path.join(__dirname, 'public')));

      // Enable CORS
/*
      app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });
*/
      app.use(cors());
      
      // Error handler
      app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(err.status || 500);
        res.json({
          message: err.message,
          error: (app.get('env') === 'development' ? err : {})
        });
        next(err);
      });

      // Config application routes
      appRoutes.configRoutes();

      app.listen(configData.port);
      logger.info('[SERVER] Listening on port ' + configData.port);

    });

}
