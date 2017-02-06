import * as logger from 'winston';

import * as passport from 'passport';
import { Strategy as LocalStrategy, IVerifyOptions as ILocalVerifyOptions } from 'passport-local';
import { Strategy as JwtStrategy, StrategyOptions as JwtStrategyOptions, ExtractJwt } from 'passport-jwt';
import * as jwtp from 'passport-jwt';
import * as jwt from 'jsonwebtoken';

import { Container } from 'typedi';

import { UserEntity } from '../entities/user.entity.model';
import { UserServiceComponent, ValidationInfo, ValidationStatus } from '../services/user.service.component';

import { Config } from '../_singletons/config';
import { BEARER } from 'jsmoney-server-api';

let config = Container.get<Config>(Config);

const expiration: string = config.data().passport.expiration;

const jwtParams: JwtStrategyOptions = {
  secretOrKey: config.data().passport.secret, //config.passport.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  algorithms: ['HS256']
};

export function makeToken(user: UserEntity): string {
  let x = jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role
    },
      jwtParams.secretOrKey,
    {
      expiresIn: expiration,
      algorithm: 'HS256'
    }
  );

  let y = jwt.verify(x, jwtParams.secretOrKey);

  logger.info('[SERVER] u = ' + JSON.stringify(user));
  logger.info('[SERVER] x = ' + x);
  logger.info('[SERVER] y = ' + JSON.stringify(y, null, 4));

  return BEARER + ' ' + x;
}


export function configPassport(): void {
  logger.info('[SERVER] Starting passport configuration');

  let userServiceComponent: UserServiceComponent = Container.get<UserServiceComponent>(UserServiceComponent);

  let validateUsernamePassword = function(uname: string, pwd: string, done: (error: any, user?: any, options?: ILocalVerifyOptions) => void): void {
    userServiceComponent.validateUserByCredentials(uname, pwd)
    .then((info: ValidationInfo) => {
      if (info.status === ValidationStatus.Validated) {
        let token: string = makeToken(info.user);
        done(null, {user: info.user, token: token });
      } else if (info.status === ValidationStatus.NoUser) {
        done(null, false, { message: 'Unknown user'});
      } else if (info.status === ValidationStatus.WrongPassword) {
        done(null, false, { message: 'Incorrect password'});
      }
    })
    .catch(err => {
      done(err);
    });
  };

  let validateToken = function(payload: any, done: (error: any, user?: any, info?: any) => void): void {
    logger.info('[SERVER] In token Strategy: Got payload ' + JSON.stringify(payload));
    if (payload && payload.id && payload.username && payload.role) {
      let id: string = payload.id;
      let username: string = payload.username;
      let role: string = payload.role;
      userServiceComponent.getUserEntityById(id)
      .then((user: UserEntity) => {
        logger.info('[SERVER] In Strategy: Got user by id' + JSON.stringify(user));
        done(null, user)
      })
      .catch(err => {
        logger.info('[SERVER] Error in findoneuser, ' + JSON.stringify(err));
        done(err);
      });
    } else {
      logger.info('[SERVER] other error');
      done('Something got wrong in validateToken');
    }

  }

  passport.use('local', new LocalStrategy(validateUsernamePassword));
  passport.use('token', new jwtp.Strategy(jwtParams, validateToken));

}
